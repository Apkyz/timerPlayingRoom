from django.http import HttpResponseRedirect
from django.utils.http import url_has_allowed_host_and_scheme 
from django.shortcuts import render
from django.utils import timezone
from django.contrib.auth import authenticate,login

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import Timer, Message

from .serializers import TimerSerializer

def index(request):
    timer = Timer.objects.first()
    time = None
    if  timer and not timer.is_over():

        time = timer.display_time()
    
    return render(request, 'index.html', {"launch_time": time})

def admin(request):

    if not  request.user.is_authenticated:

        return HttpResponseRedirect('/admin/login/?next=admin/')

    return render(request, 'admin.html')

def login_admin(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            next = request.GET.get('next')
            next_url = next if url_has_allowed_host_and_scheme(next, allowed_hosts=request.get_host()) else '/'
            return HttpResponseRedirect("/"+next_url)
        else:
            return render(request, 'loginAdmin.html', {'error': 'Invalid credentials', 'username': username})
        
    return render(request, 'loginAdmin.html')

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

        timer.send_ticket("start")

        return Response({'launch_time': timer.display_time()})
    
    @action(detail=False, methods=['post'])
    def reset_timer(self, request):    

        timer = Timer.objects.first()
        if timer:
            timer.send_ticket("reset")
            timer.delete()


        return Response("Timer reset")
    
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Timer.objects.all()
    serializer_class = TimerSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send_message(self, request):
        content = request.data.get('content')
        user = request.user.username

        message = Message.objects.create(content=content, user=user)
        message.send_ticket() 

        return Response({'content': content, 'user': user})