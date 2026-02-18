from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Customer
from .models import Booking


@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    model = Customer

    list_display = (
        "customer_full_name",
        "customer_phone",
        "role",
        "is_active",
        "is_staff",
    )
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("customer_full_name", "customer_phone")
    ordering = ("customer_phone",)

    fieldsets = (
        (None, {"fields": ("customer_phone", "password")}),
        ("Personal Info", {"fields": ("customer_full_name", "customer_email")}),
        ("Role & Permissions", {
            "fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        ("Important dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "customer_phone",
                "customer_full_name",
                "customer_email",
                "role",
                "password1",
                "password2",
                "is_active",
                "is_staff",
            ),
        }),
    )

    readonly_fields = ("last_login",)



admin.site.register(Booking)