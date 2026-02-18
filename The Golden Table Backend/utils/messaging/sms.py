from django.conf import settings
from twilio.rest import Client


def send_sms(phone, message):
    if settings.DEBUG and not settings.SEND_REAL_SMS:
        print(f"[DEV SMS]\nTo: {phone}\n{message}")
        return "dev"

    if not phone.startswith("+"):
        phone = "+91" + phone

    client = Client(
        settings.TWILIO_ACCOUNT_SID,
        settings.TWILIO_AUTH_TOKEN
    )

    sms = client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone
    )

    return sms.sid