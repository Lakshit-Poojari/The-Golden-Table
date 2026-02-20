from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import (CustomerRegisterSerializer, CustomerLoginJWTSerializer, CustomerOTPVerifySerializer, 
                          CustomerResendOTPSerializer, BookingCreateSerializer, MyBookingSerializer, 
                          CustomerForgotPasswordSerializer, CustomerVerifyResetOTPSerializer, CustomerResetPasswordSerializer)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Booking
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from utils.messaging.dispatcher import send_message
from utils.messaging.templates import RegistrationOTP, RegistrationSuccess, BookingConfirmation

# Create your views here.

@api_view(["POST"])
def customer_register(request):
    serializer = CustomerRegisterSerializer(data = request.data)
    if serializer.is_valid():
        customer = serializer.save()

        # 📩 Send registration OTP
        content = RegistrationOTP(customer.otp)
        send_message(
            customer.customer_email,
            customer.customer_phone,
            content["subject"],
            content["message"]
        )
        return Response(
            {"message":"Customer registered successfully"},
              status= status.HTTP_201_CREATED
              )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([AllowAny])
def verify_customer_otp(request):
    serializer = CustomerOTPVerifySerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.validated_data["customer"]

        content = RegistrationSuccess(customer.customer_full_name)

        send_message(
            customer.customer_email,
            customer.customer_phone,
            content["subject"],
            content["message"]
        )
        return Response(
            {"message": "Phone number verified successfully"},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=400)

@api_view(["POST"])
@permission_classes([AllowAny])
def resend_customer_otp(request):
    serializer = CustomerResendOTPSerializer(data=request.data)
    if serializer.is_valid():
        customer =serializer.validated_data["customer"]

        content = RegistrationOTP(customer.otp)
        send_message(
            customer.customer_email,
            customer.customer_phone,
            content["subject"],
            content["message"]
        )
        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def customer_login(request):
    serializer = CustomerLoginJWTSerializer(
        data=request.data,
        context={"request": request}  # 🔑 important
    )
    if serializer.is_valid():
        return Response(serializer.validated_data, status=200)
    
    print("LOGIN ERRORS:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def customer_profile(request):
    return Response({
        "message": "JWT Authenticated",
        "customer_phone": request.user.customer_phone,
        "customer_name": request.user.customer_full_name,
        "customer_email": request.user.customer_email,
        "is_phone_verified": request.user.is_phone_verified,
    })

class CreateBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("STEP 1: Booking API hit")

        serializer = BookingCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        print("STEP 2: Serializer valid")

        booking = serializer.save()
        print("STEP 3: Booking saved, ID =", booking.id)

        customer = request.user
        print("STEP 4: Customer =", customer.customer_email)

        content = BookingConfirmation(
            customer.customer_full_name,
            booking.booking_date,
            booking.time_slot,
            booking.id
        )
        print("STEP 5: Email content prepared")

        send_message(
            customer.customer_email,
            customer.customer_phone,
            content["subject"],
            content["message"]
        )
        print("STEP 6: send_message() called")

        return Response(
            {
                "message": "Booking created successfully",
                "booking_id": booking.id
            },
            status=status.HTTP_201_CREATED
        )


class MyBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user

        bookings = Booking.objects.filter(
            customer_phone = customer.customer_phone
            ).order_by("-created_at")

        serializer = MyBookingSerializer(bookings, many = True)

        return Response({
            "count" : bookings.count(),
            "bookings": serializer.data
        }, status=status.HTTP_200_OK)
    
class CancelBookingAPIView(APIView):
    permission_classes =[IsAuthenticated]

    def post(self, request, booking_id):
        customer = request.user

        booking = get_object_or_404(
            Booking, id = booking_id, customer_phone = customer.customer_phone
        )
       
        if booking.status == "CANCELLED":
            return Response({"message": "Booking is already cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        
        if booking.status == "CHECKED_IN":
            return Response({"message": "Checked-in booking cannot be cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = "CANCELLED"
        booking.save()

        return Response({"message":"Booking cancelled successfully"}, status=status.HTTP_200_OK)
    
@api_view(["POST"])
@permission_classes([AllowAny])
def customer_forgot_password(request):
    serializer = CustomerForgotPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    customer = serializer.validated_data.get("customer")

    if customer:
        send_message(
            customer.customer_email,
            customer.customer_phone,
            "Reset Password OTP",
            f"Your password reset OTP is {customer.otp}"
        )

    return Response(
        {"message": "If phone exists, OTP has been sent"},
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    serializer = CustomerVerifyResetOTPSerializer(data=request.data)
    if serializer.is_valid():
        return Response({"message": "OTP verified"}, status=200)
    return Response(serializer.errors, status=400)

@api_view(["POST"])
@permission_classes([AllowAny])
def customer_reset_password(request):
    serializer = CustomerResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=400)
