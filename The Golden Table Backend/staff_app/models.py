from django.db import models
from django.core.validators import MinValueValidator


class Table(models.Model):
    table_number = models.PositiveIntegerField(unique=True, db_index=True)
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Table {self.table_number} (seats {self.capacity})"