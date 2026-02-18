def RegistrationOTP(otp):
    return {
        "subject": "Verify Your Account - The Golden Table",
        "message": (
            f"Your OTP for registration is {otp}.\n"
            f"This OTP is valid for 5 minutes."
        )
    }

def RegistrationSuccess(customer_name):
    return {
        "subject": "Welcome to The Golden Table",
        "message": (
            f"Hi {customer_name},\n\n"
            f"You have successfully registered with The Golden Table.\n"
            f"We’re excited to serve you!"
        )
    }

def BookingConfirmation(customer_name, booking_date, booking_time, booking_id):
    return {
         "subject": "Table Booking Confirmed",
        "message": (
            f"Hi {customer_name},\n\n"
            f"Your table has been successfully booked.\n"
            f"Booking ID: {booking_id}\n"
            f"Date: {booking_date}\n"
            f"Time: {booking_time}\n\n"
            f"Thank you for choosing The Golden Table."
        )
    }

def checkinOTP(otp):
    return {
        "subject": "Restaurant Check-in OTP",
        "message": (
            f"Your OTP for restaurant check-in is {otp}.\n"
            f"Please share it with the staff.\n"
            f"Valid for 5 minutes."
        )
    }