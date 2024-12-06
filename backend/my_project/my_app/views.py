from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.
def home(req):
    return HttpResponse("this is home")

@api_view(['GET'])
def example_view(req):

    return Response({"message": "Hello from django api"})

@api_view(['POST'])
def create_user(req):
    data = req.data
    try:
        hashed_pass = make_password(data.get('password'))
        user = Project(
            firstname = data.get('firstname'),
            lastname = data.get('lastname'),
            username = data.get('username'),
            email = data.get('email'),
            password = hashed_pass
        )
        user.save()
        return Response({"message": "Data received successfully", "data": data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def login(req):
    data = req.data
    usermail = data.get('usermail')

    try:
        user = Project.objects.get(username=usermail)
    except Project.DoesNotExist:
        try:
            user = Project.objects.get(email=usermail)
        except Project.DoesNotExist:
            return Response(status=404)
        
    if check_password(data.get('password'), user.password):
        return Response(status=200)
    else:
        return Response(status=404)
    

@api_view(['GET'])
def retrieve_user(req):

    try:
        users = Project.objects.all().values('username', 'email')
        user_list = []

        user_list = [{'username': user['username'], 'email': user['email']} for user in users]
        return Response(user_list, status=200)
    except Exception as e:
        print(e)