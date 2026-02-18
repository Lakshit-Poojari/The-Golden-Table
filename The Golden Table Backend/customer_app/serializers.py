from rest_framework import serializers
from .models import Customer, Booking
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db import IntegrityError
import random
from staff_app.models import Table
from django.db.models import Max

#  Serializer for New Customer Registration
class CustomerRegisterSerializer(serializers.ModelSerializer):
    customer_password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = [
            "customer_full_name",
            "customer_phone",
            "customer_email",
            "customer_password"
        ]

    def validate_customer_phone(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Enter a valid 10-digit phone number")
        return value

    def create(self, validated_data):
        customer_password = validated_data.pop("customer_password")

        otp = str(random.randint(100000, 999999))

        user = Customer.objects.create_user(
            customer_password=customer_password,
            otp=otp,
            otp_created_at=timezone.now(),
            is_phone_verified=False,
            **validated_data
        )

        # TODO: send OTP via SMS (later)
        print("OTP for testing:", otp)

        return user
    
class CustomerOTPVerifySerializer(serializers.Serializer):
    customer_phone = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, data):
        try:
            user = Customer.objects.get(customer_phone=data["customer_phone"])
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Customer not found")
        
        if user.is_phone_verified:
            raise serializers.ValidationError("Phone number already verified")

        if not user.otp:
            raise serializers.ValidationError("No OTP found. Please request a new one.")

        if user.is_otp_expired():
            raise serializers.ValidationError("OTP has expired")

        if user.otp != data["otp"]:
            raise serializers.ValidationError("Invalid OTP")

        user.is_phone_verified = True
        user.otp = None
        user.otp_created_at = None
        user.save()

        return {"customer": user}

class CustomerResendOTPSerializer(serializers.Serializer):
    customer_phone = serializers.CharField()

    def validate(self, data):
        try:
            user = Customer.objects.get(customer_phone = data["customer_phone"])
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Customer not found")
        
        if user.is_phone_verified:
            raise serializers.ValidationError("Phone number already verified")
        
        if user.otp and not user.is_otp_expired():
            raise serializers.ValidationError(
                "OTP already sent. Please wait before requesting a new one."
            )
        
        otp = str(random.randint(100000, 999999))

        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()

                # TODO: send OTP via SMS
        print("Resent OTP for testing:", otp)

        return {"customer": user}

# Customer Login Serializer
class CustomerLoginJWTSerializer(serializers.Serializer):
    customer_phone = serializers.CharField()
    customer_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            request=self.context.get("request"),
            username=data["customer_phone"],
            password=data["customer_password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_phone_verified:
            raise serializers.ValidationError("Phone number not verified")

        refresh = RefreshToken.for_user(user)

        return {
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "customer": {
                "id": user.id,
                "name": user.customer_full_name
            }
        }
    
class BookingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = [
            "booking_date",
            "time_slot",
            "number_of_guests",
        ]

    def validate_number_of_guests(self, value):
        if value <= 0:
            raise serializers.ValidationError("Number of guests must be at least 1")

        max_capacity = Table.objects.aggregate(
            max_cap=Max("capacity")
        )["max_cap"]

        if not max_capacity:
            raise serializers.ValidationError("No tables are configured in the system.")

        if value > max_capacity:
            raise serializers.ValidationError(
                f"Maximum {max_capacity} guests allowed per booking."
            )

        return value

    def validate_booking_date(self, value):
        today = timezone.localdate()
        if value < today:
            raise serializers.ValidationError("Booking date cannot be in the past")
        return value

    def validate(self, data):
        request = self.context["request"]
        customer = request.user

        booking_date = data["booking_date"]
        time_slot = data["time_slot"]
        guests = data["number_of_guests"]

        # ✅ Block double booking ONLY if NOT cancelled
        if Booking.objects.filter(
            booking_date=booking_date,
            time_slot=time_slot,
            customer_phone=customer.customer_phone
        ).exclude(status="CANCELLED").exists():
            raise serializers.ValidationError(
                "You already have a booking for this time slot."
            )

        # ✅ Find tables already booked (exclude cancelled)
        booked_table_ids = Booking.objects.filter(
            booking_date=booking_date,
            time_slot=time_slot
        ).exclude(status="CANCELLED").values_list("table_id", flat=True)

        # ✅ Find available table
        table = Table.objects.filter(
            capacity__gte=guests,
            is_active=True
        ).exclude(id__in=booked_table_ids).order_by("capacity").first()

        if not table:
            raise serializers.ValidationError(
                "No table available for this time slot."
            )

        data["table"] = table
        return data

    def create(self, validated_data):
        customer = self.context["request"].user

        validated_data["customer_full_name"] = customer.customer_full_name
        validated_data["customer_phone"] = customer.customer_phone
        validated_data["customer_email"] = customer.customer_email

        return Booking.objects.create(**validated_data)


class MyBookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_date",
            "time_slot",
            "number_of_guests",
            "status",
            "created_at",
        ]


class CustomerForgotPasswordSerializer(serializers.Serializer):
    customer_phone = serializers.CharField()

    def validate(self, data):
        phone = data["customer_phone"]
        user = Customer.objects.filter(customer_phone=phone).first()

        # SECURITY: don't reveal if user exists
        if not user:
            data["customer"] = None
            return data

        otp = str(random.randint(100000, 999999))

        user.otp = otp
        user.otp_created_at = timezone.now()
        user.is_reset_otp_verified = False
        user.save()

        print("Forgot password OTP:", otp)  # testing only

        data["customer"] = user
        return data

class CustomerVerifyResetOTPSerializer(serializers.Serializer):
    customer_phone = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, data):
        try:
            user = Customer.objects.get(customer_phone=data["customer_phone"])
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Invalid request")

        if user.otp != data["otp"]:
            raise serializers.ValidationError("Invalid OTP")

        if user.is_otp_expired():
            raise serializers.ValidationError("OTP expired")

        user.is_reset_otp_verified = True
        user.save()

        return {"customer": user}

class CustomerResetPasswordSerializer(serializers.Serializer):
    customer_phone = serializers.CharField()
    new_password = serializers.CharField(min_length=6)

    def validate(self, data):
        try:
            user = Customer.objects.get(customer_phone=data["customer_phone"])
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Invalid request")

        if not user.is_reset_otp_verified:
            raise serializers.ValidationError("OTP not verified")

        user.set_password(data["new_password"])

        # cleanup
        user.otp = None
        user.otp_created_at = None
        user.is_reset_otp_verified = False

        user.save()
        return data
