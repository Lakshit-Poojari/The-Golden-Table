from rest_framework import serializers
from .models import Menu

class MenuUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ["id", "title", "menu_pdf"]

    def validate_menu_pdf(self, file):

        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

        if file.size > MAX_FILE_SIZE:
            raise serializers.ValidationError("File size must be under 5MB.")
            
    #  Check file extension
        if not file.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are allowed." )

        # Optional: check MIME type
        if file.content_type != "application/pdf":
            raise serializers.ValidationError("Uploaded file must be a PDF.")

        return file

    def create(self, validated_data):
        Menu.objects.filter(menu_is_active = True).update(menu_is_active = False)

        return Menu.objects.create(menu_is_active = True, **validated_data)