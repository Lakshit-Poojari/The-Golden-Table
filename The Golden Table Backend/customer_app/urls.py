from django.urls import path
from .views import (customer_register, verify_customer_otp, resend_customer_otp, 
                    customer_login, customer_profile, CreateBookingAPIView, MyBookingAPIView, CancelBookingAPIView,
                    customer_forgot_password, verify_reset_otp, customer_reset_password)


urlpatterns = [
    path("register/", customer_register),            #  127.0.0.1:8000/customer/register/ 
    path("verify-otp/", verify_customer_otp),
    path("resend-otp/", resend_customer_otp), 
    path("login/", customer_login),                  #  127.0.0.1:8000/customer/login/
    path("customer_profile/", customer_profile),     #  127.0.0.1:8000/customer/customer_profile/
    path("bookings/create/", CreateBookingAPIView.as_view(), name="create-booking"),        #  127.0.0.1:8000/customer/bookings/create/
    path("bookings/my_bookings/", MyBookingAPIView.as_view(), name="my-booking"),            #  127.0.0.1:8000/customer/bookings/my_bookings/
    path("bookings/<int:booking_id>/cancel/", CancelBookingAPIView.as_view()),   
    path("forgot-password/", customer_forgot_password),
    path("verify-reset-otp/", verify_reset_otp),
    path("reset-password/", customer_reset_password),
]
