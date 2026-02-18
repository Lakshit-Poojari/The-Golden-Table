from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .serializers import StaffLoginSerializer
from rest_framework.views import APIView
from customer_app.models import Booking
import random
from django.utils import timezone
from datetime import timedelta
from staff_app.models import Table
from utils.messaging.templates import checkinOTP
from utils.messaging.dispatcher import send_message
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .permissions import IsStaffUser
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import BookingListSerializer

# Create your views here.

class StaffLoginView(APIView):
    permission_classes = []  # public

    def post(self, request):
        serializer = StaffLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class StaffLogoutView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            raise ValidationError("Refresh token is required")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            raise ValidationError("Invalid token")

        return Response(
            {"message": "Logged out successfully"},
            status=status.HTTP_200_OK
        )

class StaffProfileView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):
        user = request.user

        return Response({
            "full_name": user.customer_full_name,
            "phone": user.customer_phone,
            "role": user.role,
        })
    
class SomeStaffView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):
        user = request.user

        return Response({
            "staff_name": user.customer_full_name,
            "role": user.role
        })

class StaffSendOTPView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                id=booking_id,
                status="CONFIRMED"
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Invalid or unconfirmed booking"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Block resend if OTP still valid
        if booking.otp_expires_at and booking.otp_expires_at > timezone.now():
            return Response(
                {"error": "OTP already sent. Please wait before resending."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        booking.otp = otp
        booking.otp_expires_at = timezone.now() + timedelta(minutes=5)
        booking.is_otp_verified = False
        booking.save()

        # Send CHECK-IN OTP
        content = checkinOTP(otp)
        send_message(
            booking.customer_email,
            booking.customer_phone,
            content["subject"],
            content["message"]
        )

        return Response(
            {"message": "OTP sent to customer"},
            status=status.HTTP_200_OK
        )


class StaffConfirmBookingView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        if booking.status != "PENDING":
            return Response(
                {"error": "Only pending bookings can be confirmed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "CONFIRMED"
        booking.save()

        return Response(
            {
                "message": "Booking confirmed successfully",
                "status": booking.status
            },
            status=status.HTTP_200_OK
        )

class StaffBookingListView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):
        phone = request.query_params.get("phone")
        today = timezone.localdate()

        base_queryset = Booking.objects.filter(
            booking_date=today,
            status__in=[
                "PENDING",
                "CONFIRMED",
                "WAITING",
                "CHECKED_IN",
                "COMPLETED"
            ]

        )

        if phone:
            base_queryset = base_queryset.filter(customer_phone=phone)

        serializer = BookingListSerializer(base_queryset, many=True)
        return Response(serializer.data)
    
    
class StaffCancelBookingView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        if booking.status == "COMPLETED":
            return Response(
                {"error": "Completed bookings cannot be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "CANCELLED"
        booking.save()

        return Response({"message": "Booking cancelled by staff"})

    
class StaffVerifyArrivalView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        if booking.status != "CONFIRMED":
            return Response(
                {"error": "Booking not eligible for check-in"},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp = request.data.get("otp")
        table_available = request.data.get("table_available")

        if not otp:
            return Response({"error": "OTP is required"}, status=400)

        if table_available is None:
            return Response(
                {"error": "table_available is required"},
                status=400
            )

        if booking.otp_expires_at < timezone.now():
            return Response({"error": "OTP expired"}, status=400)

        if booking.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        # ✅ Staff explicitly said table is available
        if table_available is True:
            table = Table.objects.filter(
                is_active=True,
                capacity__gte=booking.number_of_guests
            ).order_by("capacity").first()

            if not table:
                booking.status = "WAITING"
            else:
                table.is_active = False
                table.save()

                booking.table = table
                booking.status = "CHECKED_IN"

        # ⏳ Staff explicitly marked waiting
        else:
            booking.status = "WAITING"

        booking.is_otp_verified = True
        booking.otp = None
        booking.otp_expires_at = None
        booking.save()

        return Response(
            {
                "message": "Customer verified",
                "status": booking.status,
                "table_number": booking.table.table_number if booking.table else None
            },
            status=200
        )


class StaffAssignTableView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        if booking.status != "WAITING":
            return Response(
                {"error": "Booking is not in waiting state"},
                status=status.HTTP_400_BAD_REQUEST
            )

        table = Table.objects.filter(
            is_active=True,
            capacity__gte=booking.number_of_guests
        ).order_by("capacity").first()

        if not table:
            return Response(
                {"error": "No table available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        table.is_active = False
        table.save()

        booking.table = table
        booking.status = "CHECKED_IN"
        booking.save()

        return Response(
            {
                "message": "Table assigned successfully",
                "table_number": table.table_number
            },
            status=status.HTTP_200_OK
        )

class StaffCompleteBookingView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        if booking.status != "CHECKED_IN":
            return Response(
                {"error": "Only checked-in bookings can be completed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.table:
            table = booking.table
            table.is_active = True
            table.save()
            booking.table = None

        booking.status = "COMPLETED"
        booking.save()

        return Response(
            {"message": "Booking completed successfully"},
            status=status.HTTP_200_OK
        )
