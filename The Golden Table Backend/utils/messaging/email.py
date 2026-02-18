from django.core.mail import send_mail
from django.conf import settings

def send_email(to_email, subject, message):
    print("EMAIL FUNC ENTERED")

    send_real = getattr(settings, "SEND_REAL_EMAIL", False)
    print("DEBUG =", settings.DEBUG, "| SEND_REAL_EMAIL =", send_real)

    if settings.DEBUG and not send_real:
        print("[DEV EMAIL]")
        print("To:", to_email)
        print(message)
        return

    print("SENDING REAL EMAIL NOW")

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        fail_silently=False,
    )
