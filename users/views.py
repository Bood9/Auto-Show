from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserCommissionRequestSerializer, UserTestDriveRequestSerializer
from cars.models import CommissionRequest, TestDriveRequest

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class DashboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        commission_requests = CommissionRequest.objects.filter(user=user)
        test_drive_requests = TestDriveRequest.objects.filter(user=user).exclude(
            status__in=['cancelled', 'completed']
        )

        return Response({
            'commission_requests': UserCommissionRequestSerializer(commission_requests, many=True).data,
            'test_drive_requests': UserTestDriveRequestSerializer(test_drive_requests, many=True).data,
            'user': {
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser
            }
        })
