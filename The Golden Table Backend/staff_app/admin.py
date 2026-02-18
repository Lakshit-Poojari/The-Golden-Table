from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Table


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("table_number", "capacity", "is_active")
    list_filter = ("is_active",)



