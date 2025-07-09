from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.database import get_db
from app import models
from app.schemas import UserCreate, UserOut, Token
from app.config import settings
from app.utils.email import send_reset_email
from uuid import uuid4

auth_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password.strip(), hashed_password.strip())
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# Registration
@auth_router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = models.User(email=user.email.strip(), hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# OAuth2 password grant login
@auth_router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == form_data.username.strip()).first()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.email == "gpt3@nightingale.ai":
        token = create_access_token(data={"user_id": db_user.id}, expires_delta=timedelta(days=90))
    else:
        token = create_access_token(data={"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}

# JSON login 
@auth_router.post("/login-json", response_model=Token)
def login_json(
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    print("GPT login payload:", data)
    
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing username or password")

    db_user = db.query(models.User).filter(models.User.email == username.strip()).first()

    if not db_user or not verify_password(password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.email == "gpt3@nightingale.ai":
        token = create_access_token(data={"user_id": db_user.id}, expires_delta=timedelta(days=90))
    else:
        token = create_access_token(data={"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}

# Forgot Password
@auth_router.post("/forgot-password")
def forgot_password(data: dict = Body(...), db: Session = Depends(get_db)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(models.User).filter(models.User.email == email.strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found with this email")

    token = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    db_token = models.PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()

    send_reset_email(user.email, token)

    return {"message": "Reset email sent"}

# Reset Password
@auth_router.post("/reset-password")
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    db_token = db.query(models.PasswordResetToken).filter(models.PasswordResetToken.token == token).first()

    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.id == db_token.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_pw = pwd_context.hash(new_password.strip())
    user.hashed_password = hashed_pw
    db.commit()

    db.delete(db_token)
    db.commit()

    return {"message": "Password has been reset"}
