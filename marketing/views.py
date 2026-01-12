from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import News, Promotion, Review
from .serializers import NewsSerializer, PromotionSerializer, ReviewSerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
