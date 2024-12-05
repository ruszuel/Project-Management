from django.db import models

# Create your models here.

class Project(models.Model):
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    username = models.CharField(max_length=30, unique=True)
    email = models.CharField(max_length=100, unique=True, primary_key=True)
    password = models.CharField(max_length=100)

    class Meta:
        db_table = 'users'
        managed = False