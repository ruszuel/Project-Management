from django.urls import path
from .views import *


urlpatterns = [
    path('', home),
    path('api/example', example_view),
    path('api/submit', example_post),
]
