from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.
def home(req):
    return HttpResponse("this is home")

@api_view(['GET'])
def example_view(req):
    return Response({"message": "Hello from django api"})

@api_view(['POST'])
def example_post(req):
    data = req.data
    print(data)
    return Response({"message": "Data received successfully", "data": data}, status=status.HTTP_200_OK)