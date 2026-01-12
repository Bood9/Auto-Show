from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Car(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('test_drive', 'On Test Drive'),
    ]

    TRANSMISSION_CHOICES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('robot', 'Robot'),
        ('cvt', 'CVT'),
    ]

    BODY_TYPE_CHOICES = [
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('hatchback', 'Hatchback'),
        ('coupe', 'Coupe'),
        ('minivan', 'Minivan'),
        ('pickup', 'Pickup'),
    ]

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2100)])
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mileage = models.PositiveIntegerField(help_text="Mileage in km")
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    body_type = models.CharField(max_length=20, choices=BODY_TYPE_CHOICES)
    color = models.CharField(max_length=50)
    engine_volume = models.DecimalField(max_digits=4, decimal_places=1, help_text="Engine volume in liters")
    horsepower = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_commission = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False, help_text="Show in featured section")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cars/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.car}"

class CommissionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='commission_requests')
    client_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField()
    expected_price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commission: {self.brand} {self.model} from {self.client_name}"

class TestDriveRequest(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_drive_requests')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='test_drives')
    client_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    requested_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Test Drive: {self.client_name} for {self.car}"
