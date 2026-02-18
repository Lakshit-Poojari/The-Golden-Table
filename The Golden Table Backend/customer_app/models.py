# Models → Migrations → Admin Panel → APIs → JWT → Frontend

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from staff_app.models import Table

# Create your models here.
class CustomerManager(BaseUserManager):
    def create_user(self, customer_phone, customer_password=None, **extra_fields):
        if not customer_phone:
            raise ValueError("Customer phone number is required")

        user = self.model(customer_phone=customer_phone, **extra_fields)
        user.set_password(customer_password)
        user.save(using=self._db)
        return user

    def create_superuser(self, customer_phone, customer_password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "manager")

        return self.create_user(customer_phone, customer_password, **extra_fields)


class Customer(AbstractBaseUser, PermissionsMixin):
    customer_full_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15, unique=True)
    customer_email = models.EmailField(null=True, blank=True)

    # OTP-related fields (customer side)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)

    # 🔑 AUTH FLAGS
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # 🔑 ROLE (THIS REPLACES Staff MODEL)
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("operator", "Operator"),
        ("manager", "Manager"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_reset_otp_verified = models.BooleanField(default=False)
    
    objects = CustomerManager()

    USERNAME_FIELD = "customer_phone"
    REQUIRED_FIELDS = ["customer_full_name"]

    def is_otp_expired(self):
        if not self.otp_created_at:
            return True
        return timezone.now() > self.otp_created_at + timezone.timedelta(minutes=5)

    def __str__(self):
        return self.customer_phone
    
    
class Booking(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("WAITING", "Waiting for Table"),
        ("CHECKED_IN", "Checked In"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    )

    TIME_SLOTS = (
        ("12:00-13:30", "12:00 PM - 01:30 PM"),
        ("13:30-15:00", "01:30 PM - 03:00 PM"),
        ("18:30-20:00", "06:30 PM - 08:00 PM"),
        ("20:00-21:30", "08:00 PM - 09:30 PM"),
        ("21:30-23:00", "09:30 PM - 11:00 PM"),
    )

    #Customer Detail
    customer_full_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15,  db_index=True)
    customer_email = models.EmailField(blank=True, null=True)


    # Booking Detail
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=20, choices=TIME_SLOTS)
    number_of_guests = models.PositiveIntegerField()

    #OTP 
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expires_at = models.DateTimeField(blank=True, null=True)
    is_otp_verified = models.BooleanField(default=False)

    #Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    #Audit Field

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #Table
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True )

    class Meta:
        ordering = ["-created_at"]
        # unique_together = ("booking_date", "time_slot", "table")


    def __str__(self):
        return f"{self.customer_full_name} - {self.booking_date} {self.time_slot}"
    
