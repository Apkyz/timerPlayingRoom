from django.shortcuts import render
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import Timer

from .serializers import TimerSerializer

def index(request):
    timer = Timer.objects.first()
    time = None
    if  timer and not timer.is_over():

        time = timer.display_time()
    
    return render(request, 'index.html', {"launch_time": time})


class TimerViewSet(viewsets.ModelViewSet):
    queryset = Timer.objects.all()
    serializer_class = TimerSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def get_time(self, request):
        timer = Timer.objects.first()
        if not timer:
            timer = Timer.objects.create(launch_time=timezone.now())

        return Response({'launch_time': timer.display_time()})
    
    @action(detail=False, methods=['post'])
    def start_timer(self, request):
        timer = Timer.objects.first()
        if not timer:
            timer = Timer.objects.create(launch_time=timezone.now())

        timer.launch_time = timezone.now()
        timer.save()

        return Response({'launch_time': timer.display_time()})
    
    @action(detail=False, methods=['post'])
    def reset_timer(self, request):
        


        timer = Timer.objects.first()
        if timer:
            timer.delete()

        return Response("Timer reset")