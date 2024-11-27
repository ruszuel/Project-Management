from django.db import models

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=30)
    username = models.CharField(max_length=30, unique=True)
    email = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'users'
        managed = False