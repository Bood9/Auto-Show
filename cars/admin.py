from django.contrib import admin
from .models import Car, CarImage, CommissionRequest, TestDriveRequest

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model', 'year', 'price', 'status', 'is_commission')
    list_filter = ('status', 'transmission', 'body_type', 'is_commission')
    search_fields = ('brand', 'model', 'description')
    inlines = [CarImageInline]

@admin.register(CommissionRequest)
class CommissionRequestAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model', 'client_name', 'phone', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('brand', 'model', 'client_name', 'phone')

@admin.register(TestDriveRequest)
class TestDriveRequestAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'car', 'requested_date', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('client_name', 'phone')