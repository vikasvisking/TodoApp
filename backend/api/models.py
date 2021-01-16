from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class Basket(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name + ' : ' + self.user.get_full_name()


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    title = models.CharField(max_length=30)
    description = models.TextField()
    done = models.BooleanField()
    updated = models.DateTimeField()
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)

    def __str__(self):
        return self.basket.name + ' : ' + self.title + ' made by ' + self.user.get_full_name()

    def save(self, *arg, **kwargs):
        self.updated = datetime.now()
        super(Todo, self).save(*arg, **kwargs)