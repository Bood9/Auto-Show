from rest_framework import serializers
from django.contrib.auth.models import User
from cars.models import CommissionRequest, TestDriveRequest
from cars.serializers import CarSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class UserCommissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionRequest
        fields = '__all__'

class UserTestDriveRequestSerializer(serializers.ModelSerializer):
    car_details = CarSerializer(source='car', read_only=True)
    
    class Meta:
        model = TestDriveRequest
        fields = '__all__'
