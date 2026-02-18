from django.urls import path
from .views import (StaffLoginView, StaffLogoutView, StaffProfileView, StaffCancelBookingView, 
                    StaffBookingListView, StaffConfirmBookingView, StaffSendOTPView, 
                    StaffVerifyArrivalView, StaffCompleteBookingView, StaffAssignTableView )
urlpatterns = [
    # 🔐 Auth
    path("login/", StaffLoginView.as_view()),
    path("logout/", StaffLogoutView.as_view()),
    path("profile/", StaffProfileView.as_view()),

    # 📋 Bookings
    path("booking/list/", StaffBookingListView.as_view()),

    path("booking/<int:booking_id>/confirm/",
         StaffConfirmBookingView.as_view()),

    path("booking/<int:booking_id>/send-otp/",
         StaffSendOTPView.as_view()),

    # 🔑 OTP verification + decide WAITING / CHECKED_IN
    path("booking/<int:booking_id>/verify-arrival/",
         StaffVerifyArrivalView.as_view()),

    # 🪑 Assign table (WAITING → CHECKED_IN)
    path("booking/<int:booking_id>/assign-table/",
         StaffAssignTableView.as_view()),

    # ✅ Complete booking (CHECKED_IN → COMPLETED)
    path("booking/<int:booking_id>/complete/",
         StaffCompleteBookingView.as_view()),

    # ❌ Cancel booking
    path("booking/<int:booking_id>/cancel/",
         StaffCancelBookingView.as_view()),
]

