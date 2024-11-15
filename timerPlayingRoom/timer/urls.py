from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .views import TimerViewSet, index, admin

router = DefaultRouter()
router.register('timer', TimerViewSet, basename='timer')

urlpatterns = [
    path('', index),
    path('admin/', admin),
    path('api/', include(router.urls))

]