from django.db import models

from django.utils import timezone

import json
from asgiref.sync import async_to_sync
import channels.layers
from django.conf import settings

# Create your models here.

class Timer(models.Model):
    launch_time = models.DateTimeField()

    def __str__(self):
        return f"Timer ending at {self.launch_time}"
    
    def display_time(self):

        return self.launch_time.timestamp() * 1000
    
    def is_over(self):
        time = 45*60*1000

        is_over = timezone.now().timestamp() * 1000 - self.launch_time.timestamp() * 1000 > time
        return is_over
    

    def send_ticket(self, type):
        time = self.display_time()

        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            settings.TICKS_GROUP_NAME,
            {
                "type": "new_ticks",
                "content": json.dumps(
                    {
                        "type": type,
                        "time": time,
                    }
                ),
            },
        )