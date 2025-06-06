from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.config import settings

def send_reset_email(to_email: str, reset_token: str):
    reset_url = f"http://localhost:5173/reset-password?token={reset_token}"
 

    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject="Reset Your Nightingale Password",
        html_content=f"""
            <p>Hello from Nightingale,</p>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to continue:</p>
            <p><a href="{reset_url}">{reset_url}</a></p>
            <p>If you didn’t request this, please disregard this message.</p>
        """
    )

    try:
        sg = SendGridAPIClient(settings.sendgrid_api_key)
        response = sg.send(message)
        print("Email sent:", response.status_code)
    except Exception as e:
        print("SendGrid error:", str(e))
