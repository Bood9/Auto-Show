from rest_framework import serializers
from .models import Car, CarImage, CommissionRequest, TestDriveRequest

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'is_main']

class CarSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Car
        fields = '__all__'

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        car = Car.objects.create(**validated_data)
        if image:
            CarImage.objects.create(car=car, image=image, is_main=True)
        return car

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if image:
            # Delete old main image if exists
            instance.images.filter(is_main=True).delete()
            # Create new main image
            CarImage.objects.create(car=instance, image=image, is_main=True)
        
        return instance

class CommissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionRequest
        fields = '__all__'
        read_only_fields = ['status', 'created_at']

class TestDriveRequestSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.all(), source='car', write_only=True
    )
    
    class Meta:
        model = TestDriveRequest
        fields = '__all__'
        read_only_fields = ['created_at']
