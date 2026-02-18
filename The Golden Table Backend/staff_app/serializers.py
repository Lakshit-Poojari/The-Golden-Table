from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from customer_app.models import Booking

class StaffLoginSerializer(serializers.Serializer):
    staff_phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            customer_phone=data["staff_phone_number"],
            password=data["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive")

        if not user.is_staff:
            raise serializers.ValidationError("Not a staff account")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
        }


# class StaffConfirmBookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booking
#         fields = ["status"]

#     def validate(self, attrs):
#         booking = self.instance

#         if booking.status != "PENDING":
#             raise serializers.ValidationError(
#                 "Only pending bookings can be confirmed."
#             )

#         return attrs

class BookingListSerializer(serializers.ModelSerializer):
    # customer_name = serializers.CharField(
    #     source="customer_full_name.customer_full_name",
    #     read_only=True
    # )
    # customer_phone = serializers.CharField(
    #     source="customer_phone.customer_phone",
    #     read_only=True
    # )

    class Meta:
        model = Booking
        fields = [
            "id",
            "customer_full_name",
            "customer_phone",
            "booking_date",
            "time_slot",
            "number_of_guests",
            "status",
        ]
        read_only_fields = fields

