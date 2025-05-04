import smtplib
from email.mime.text import MIMEText

from common.utils.config import settings

EMAIL_ADDRESS = settings.email_address
EMAIL_PASSWORD = settings.email_password

def send_email(to_email: str, subject: str, body: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = EMAIL_ADDRESS
    sender_password = EMAIL_PASSWORD

    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())