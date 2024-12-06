from django.urls import path
from .views import *


urlpatterns = [
    path('', home),
    path('api/example', example_view),
    path('api/submit', create_user),
    path('api/login', login),
    path('api/retrieve', retrieve_user)
]
