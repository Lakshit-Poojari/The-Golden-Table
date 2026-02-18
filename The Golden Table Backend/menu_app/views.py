from .serializers import MenuUploadSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Menu

# Create your views here.

class MenuUploadView(APIView):
    def post(self, request):

        user = request.user

        if not user.is_authenticated or user.role != "manager":
            return Response(
                {"error": "Only managers can upload menu"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MenuUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Menu uploaded successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MenuRemoveView(APIView):
    def delete(self, request, menu_id):

        user = request.user

        if not user.is_authenticated or user.role != "manager":
            return Response(
                {"error": "Only managers can remove menu"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            menu = Menu.objects.get(id=menu_id, menu_is_active=True)
        except Menu.DoesNotExist:
            return Response(
                {"error": "Menu not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        menu.menu_is_active = False
        menu.save()

        return Response(
            {"message": "Menu removed successfully"},
            status=status.HTTP_200_OK
        )

    
class ActiveMenuView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        menu = Menu.objects.filter(menu_is_active=True).first()

        if not menu:
            return Response(
                {"message": "Menu not available"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "id": menu.id,
            "title": menu.title,
            "pdf": request.build_absolute_uri(menu.menu_pdf.url)
        })