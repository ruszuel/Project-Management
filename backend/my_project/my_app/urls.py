from django.urls import path
from .views import *


urlpatterns = [
    path('', home),
    path('api/example', example_view),
    path('api/submit', create_user),
    path('api/login', login),
    path('api/retrieve', retrieve_user),
     path('api/retrieve_member', retrieve_member),
    path('api/profile', retrieve_specific_user),
    path('api/change_pass', change_pass),
    path('api/update_profile', update_profile),
    path('api/delete_account', delete_acc),
    path('api/tasks', retrieve_tasks),
    path('api/projects', retrieve_project),
    path('api/create_project', create_project),
    path('api/members', retrieve_members),
    path('api/create_member', create_members),
     path('api/new_task', create_task),
]
