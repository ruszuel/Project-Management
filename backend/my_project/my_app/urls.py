from django.urls import path
from .views import *


urlpatterns = [
    path('', home),
    path('api/example', example_view),
    path('api/submit', create_user),
    path('api/login', login),
    path('api/retrieve', retrieve_user),
    path('api/profile', retrieve_specific_user),
    path('api/change_pass', change_pass),
    path('api/update_profile', update_profile),
    path('api/delete_account', delete_acc),
]
