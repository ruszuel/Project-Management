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
            manager_email = data.get('email'),
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
        try:
            user = Project.objects.get(username=usermail)
            print(user)
        except Project.DoesNotExist:
            try:
                user = Project.objects.get(manager_email=usermail)
                print(user)
            except Project.DoesNotExist:
                try:
                    user = Members.objects.get(username=usermail)
                    print(user)
                except Members.DoesNotExist:
                    try:
                        user = Members.objects.get(email=usermail)
                        print(user)
                    except Members.DoesNotExist:
                        return Response(status=404)
    except Project.DoesNotExist:
        return Response(status=404)

        

    if check_password(data.get('password'), user.password):
        user_data = model_to_dict(user, fields=['manager_id','firstname', 'lastname', 'username', 'manager_email', 'password'])
        return Response(user_data,status=200)
    else:
        return Response(status=404)
    

@api_view(['GET'])
def retrieve_user(req):

    try:
        users = Project.objects.all().values('username', 'manager_email')
        user_list = []

        user_list = [{'username': user['username'], 'email': user['manager_email']} for user in users]
        return Response(user_list, status=200)
    except Exception as e:
        print(e)

@api_view(['GET'])
def retrieve_member(req):

    try:
        users = Members.objects.all().values('username', 'email')
        user_list = []

        user_list = [{'username': user['username'], 'email': user['email']} for user in users]
        return Response(user_list, status=200)
    except Exception as e:
        print(e)


@api_view(['POST'])
def retrieve_specific_user(req):
    data = req.data

    try:
        userdata = Project.objects.get(username=data['username'])
        response_data = {
            'manager_id': userdata.manager_id,
            'firstname': userdata.firstname,
            'lastname': userdata.lastname,
            'username': userdata.username,
            'email': userdata.manager_email,
            'password': userdata.password,
            'role': 'manager',
        }
        return Response(response_data, status=200)
    except Project.DoesNotExist:
        try:
            userdata = Members.objects.get(username=data['username'])
            response_data = {
                'manager_id': userdata.member_id,
                'project_id': userdata.project.project_id,
                'PM': userdata.manager.manager_id,
                'firstname': userdata.firstname,
                'lastname': userdata.lastname,
                'username': userdata.username,
                'email': userdata.email,
                'password': userdata.password,
                'role': 'member',
            }
            return Response(response_data, status=200)
        except Members.DoesNotExist:
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
        try:
            user = Members.objects.get(username = data.get('username'))
            print(user.password)
            if check_password(data.get('oldPass'), user.password):
                hashed_pass = make_password(data.get('password'))
                Members.objects.filter(username = data.get('username')).update(password = hashed_pass)
                return Response(status=200)
            else:
                return Response({"message": "Wrong old pass"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"Error": "Unsuccessful"}, status=500)

@api_view(['POST'])
def update_profile(req):
    data = req.data 

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    username = data.get('username')

    try:
        updated = Project.objects.filter(username=username).update(firstname=firstname, lastname=lastname)
        if updated:
            return Response(status=200)
        
        updated = Members.objects.filter(username=username).update(firstname=firstname, lastname=lastname)
        if updated:
            return Response(status=200)

        return Response({"error": "User not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@csrf_exempt
def delete_acc(req):
    data = req.data

    try:
        user = Project.objects.get(username = data.get('username'))
        user.delete()
        return Response(status=200)
    except Exception as e:
        try:
            user = Members.objects.get(username = data.get('username'))
            user.delete()
            return Response(status=200)
        except Exception as e:
            messages.error(req, str(e))
            print(e)
            return Response(status=404)
    

@api_view(['POST'])
def retrieve_tasks(req):
    data = req.data

    try:
        task = Tasks.objects.filter(project=data.get('project')).values('task_id', 'feature', 'status', 'assigned', 'sprint', 'priority', 'deadline')
        return Response(list(task), status=200)
    except Exception as e:
        print(e)
        return Response(status=404)
    
@api_view(['POST'])
def retrieve_project(req):
    data = req.data
   
    try:
        projects = Proj.objects.filter(manager = data.get('manager')).values('project_id', 'project_title')
        return Response(list(projects), status=200)
    except Exception as e:
        print(e)
        return Response(status=404)

@api_view(['POST'])
def create_project(req):
    data = req.data 

    try:
        proj = Proj(
            project_title = data.get('title'),
            manager_id = data.get('manager')
        )
        proj.save()
        return Response(status=201)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def retrieve_members(req):
    data = req.data 

    try:
        members = Members.objects.filter(manager = data.get('manager'), project = data.get('project')).values()
        print(list(members))
        return Response(list(members), status=200)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_members(req):
    data = req.data 

    try:
        hashed_pass = make_password(data.get('password'))
        member = Members(
            project_id = data.get('project'),
            manager_id = data.get('manager'),
            firstname = data.get('firstname'),
            lastname = data.get('lastname'),
            username = data.get('username'),
            email = data.get('email'),
            password = hashed_pass
        )
        member.save()

        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)

@api_view(['POST'])
def create_task(req):
    data = req.data

    try:
        task = Tasks(
            project_id = data.get('project'),
            feature = data.get('feature'),
            status = data.get('status'),
            assigned = data.get('assigned'),
            sprint = data.get('sprint'),
            priority = data.get('priority'),
            deadline = data.get('deadline')
        )

        task.save()
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt
def delete_task(req):
    data = req.data 

    try:
        task = Tasks.objects.get(project_id = data.get('projID'), task_id = data.get('taskID'))
        task.delete()
        return Response(status=200)
    except Exception as e:
        messages.error(req, str(e))
        print(e)
        return Response(status=404)
    

@api_view(['POST'])
@csrf_exempt
def delete_member(req):
    data = req.data 

    try:
        task = Members.objects.get(project_id = data.get('projID'), member_id = data.get('memID'))
        task.delete()
        return Response(status=200)
    except Exception as e:
        messages.error(req, str(e))
        print(e)
        return Response(status=404)


@api_view(['POST'])
def retrieve_member_project(req):
    data = req.data
   
    try:
        projects = Proj.objects.filter(project_id = data.get('projID')).values('manager_id', 'project_title')
        return Response(list(projects), status=200)
    except Exception as e:
        print(e)
        return Response(status=404)
