from .email import send_email
from .sms import send_sms

def send_message(customer_email, customer_phone, subject, message):
    """
    Priority:
    1. Email (if available)
    2. SMS (fallback)
    """
    if customer_email:
        send_email(customer_email, subject, message)
        return "email"
    else:
        send_sms(customer_phone, message)
        return "sms"