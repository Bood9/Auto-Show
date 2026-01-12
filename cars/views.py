from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Car, CommissionRequest, TestDriveRequest
from .serializers import CarSerializer, CommissionRequestSerializer, TestDriveRequestSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all() # Show all cars to admin, filter for others if needed, but for now all is fine or we can filter in list
    serializer_class = CarSerializer
    filterset_fields = ['brand', 'model', 'year', 'transmission', 'body_type', 'is_commission', 'is_featured']

    def get_queryset(self):
        if self.action == 'list' and not self.request.user.is_staff:
             return Car.objects.filter(status='available')
        return Car.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class CommissionRequestViewSet(viewsets.ModelViewSet):
    queryset = CommissionRequest.objects.all().order_by('-created_at')
    serializer_class = CommissionRequestSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class TestDriveRequestViewSet(viewsets.ModelViewSet):
    queryset = TestDriveRequest.objects.all().order_by('-created_at')
    serializer_class = TestDriveRequestSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminUser]
        elif self.action in ['update', 'partial_update']:
            # Allow both admins and authenticated users (users can only update their own)
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        # Admins see all, users see only their own active requests
        if self.request.user.is_staff:
            return TestDriveRequest.objects.all().order_by('-created_at')
        elif self.request.user.is_authenticated:
            return TestDriveRequest.objects.filter(
                user=self.request.user
            ).exclude(
                status__in=['cancelled', 'completed']
            ).order_by('-created_at')
        return TestDriveRequest.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        # Users can only update their own requests
        if not self.request.user.is_staff and instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own requests")
        serializer.save()
