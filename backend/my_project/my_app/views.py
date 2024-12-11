from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

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
        return Response({"message": "Data received successfully", "data": data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def login(req):
    data = req.data
    usermail = data.get('usermail')

    try:
        user = Project.objects.get(username=usermail)
        print(user)
    except Project.DoesNotExist:
        try:
            user = Project.objects.get(email=usermail)
            print(user)
        except Project.DoesNotExist:
            return Response(status=404)
        
    if check_password(data.get('password'), user.password):
        user_data = model_to_dict(user, fields=['firstname', 'lastname', 'username', 'email', 'password'])
        return Response(user_data,status=200)
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


@api_view(['POST'])
def retrieve_specific_user(req):
    data = req.data

    try:
        userdata = Project.objects.get(username = data['username'])

        response_data = {
            'firstname': userdata.firstname,
            'lastname': userdata.lastname,
            'username': userdata.username,
            'email': userdata.email,
            'password': userdata.password,
        }
        return Response(response_data, status=200)
    except Project.DoesNotExist:
        return Response(status=404)
    
@api_view(['POST'])
def change_pass(req):
    data = req.data 

    try:
        user = Project.objects.get(username = data.get('username'))
        print(user.password)
        if check_password(data.get('oldPass'), user.password):
            hashed_pass = make_password(data.get('password'))
            Project.objects.filter(username = data.get('username')).update(password = hashed_pass)
            return Response(status=200)
        else:
            return Response({"message": "Wrong old pass"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({"Error": "Unsuccessful"}, status=500)


@api_view(['POST'])
def update_profile(req):
    data = req.data 

    try:
        firstname = data.get('firstname')
        lastname = data.get('lastname')

        Project.objects.filter(username = data.get('username')).update(firstname = firstname, lastname = lastname)
        return Response(status=200)
    except Exception:
        pass

@api_view(['POST'])
@csrf_exempt
def delete_acc(req):
    data = req.data

    try:
        user = Project.objects.get(username = data.get('username'))
        user.delete()
        return Response(status=200)
    except Exception as e:
        messages.error(req, str(e))
        print(e)
        return Response(status=404)