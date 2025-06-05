from passlib.context import CryptContext

# Setup for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Set your plain text password here
password = "demo123!"

# Hash and print
hashed_password = pwd_context.hash(password)
print("Hashed password:", hashed_password)
