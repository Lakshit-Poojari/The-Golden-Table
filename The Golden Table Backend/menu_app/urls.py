from django.urls import path
from .views import MenuUploadView, MenuRemoveView, ActiveMenuView

urlpatterns = [
    path("upload/", MenuUploadView.as_view()),          #127.0.0.1:8000/menu/upload/
    path("remove/<int:menu_id>/", MenuRemoveView.as_view()),
    path("active/", ActiveMenuView.as_view()),
]