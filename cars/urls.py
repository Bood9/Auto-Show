from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, CommissionRequestViewSet, TestDriveRequestViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'commission-requests', CommissionRequestViewSet)
router.register(r'test-drives', TestDriveRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
