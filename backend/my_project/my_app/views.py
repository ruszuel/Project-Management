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
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from datetime import datetime

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
        task = Tasks.objects.filter(project=data.get('project')).values('task_id', 'feature', 'status', 'assigned', 'sprint', 'priority', 'deadline', 'starting_date')
        return Response(list(task), status=200)
    except Exception as e:
        print(e)
        return Response(status=404)
    
@api_view(['POST'])
def retrieve_project(req):
    data = req.data
   
    try:
        projects = Proj.objects.filter(manager = data.get('manager')).values('project_id', 'project_title', 'project_description')
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
            manager_id = data.get('manager'),
            project_description= data.get('description')
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
        members = Members.objects.filter(project = data.get('project_id')).values()
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
            project_id=data.get('project'),
            manager_id=data.get('manager'),
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            username=data.get('username'),
            email=data.get('email'),
            password=hashed_pass
        )

        junction = Member_Project(
            username=member,
            project_id=data.get('project'),
        )

        member.save()
        junction.save()

        project = Proj.objects.get(project_id=data.get('project'))

        Notification.objects.create(
            message=f"You have been added to the project '{project.project_title}'.",
            recipient_member=member,  
            notification_type="Member Added"
        )
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)

@api_view(['POST'])
def create_task(req):
    data = req.data

    try:
        task = Tasks(
            project_id=data.get('project'),
            feature=data.get('feature'),
            status=data.get('status'),
            assigned=data.get('assigned'),
            sprint=data.get('sprint'),
            priority=data.get('priority'),
            deadline=data.get('deadline')
        )
        task.save()

        project = Proj.objects.get(project_id=data.get('project'))

        Notification.objects.create(
            message=f"You have been assigned a new task: '{data.get('feature')}' in the project '{project.project_title}'.",
            recipient_member=Members.objects.get(username=data.get('assigned')),
            notification_type="Task Assigned"
        )
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
        task = Members.objects.get(username = data.get('username'))
        task.delete()
        del_mem = Member_Project.objects.filter(username=data.get('username'), project_id=data.get('projID'))
        del_mem.delete()
        del_task = Tasks.objects.filter(assigned = data.get('username'), project_id = data.get('projID'))
        del_task.delete()
        return Response(status=200)
    except Exception as e:
        messages.error(req, str(e))
        print(e)
        return Response(status=404)


@api_view(['POST'])
def retrieve_member_project(req):
    data = req.data
   
    try:
        projects = Member_Project.objects.filter(username__username = data.get('username')).select_related('project')
        proj_list = [
            {
                'project_id': mem.project.project_id,
                'project_title': mem.project.project_title,
                'manager_id': mem.project.manager_id,
            }
            for mem in projects
        ]
        return Response(proj_list, status=200)
    except Exception as e:
        print(e)
        return Response(status=404)

@api_view(['POST'])
def get_specific_task(req):
    data = req.data 
    try:
        task = Tasks.objects.filter(task_id=data.get('taskID')).values()
        return Response(list(task), status=200)
    except Exception as e: 
       print(e)
       return Response(status=500)
    

@api_view(['POST'])
def update_task(req):

    data = req.data 
    features = data.get('feature')
    status = data.get('status')
    priority = data.get('priority')
    sprint = data.get('sprint')
    deadline = data.get('deadline')
    assigned = data.get('assigned')

    try:
        Tasks.objects.filter(task_id=data.get('taskID')).update(feature=features, status=status, priority=priority, sprint=sprint, deadline=deadline, assigned=assigned)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)

@api_view(['POST'])
def get_member_task(req):
    data = req.data

    try:
        task_data = Tasks.objects.filter(project_id = data.get('projID'), assigned=data.get('username')).values()
        return Response(list(task_data), status=200)
    except Exception as e:
        return Response(status=404)
    
@api_view(['POST'])
def update_indiv_task(req):

    data = req.data 
    status = data.get('status')

    try:
        Tasks.objects.filter(task_id=data.get('taskID')).update(status=status)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)


@api_view(['POST'])
def add_members(req):
    data = req.data 
    username = data.get('username')
    proj_id = data.get('proj_id')

    if not username or not proj_id:
        return Response({"error": "Username and project ID are required."}, status=400)

    try:
        member = Members.objects.get(username=username)
        project = Proj.objects.get(project_id=proj_id)

        ass_mem = Member_Project(
            username=member,
            project=project
        )
        ass_mem.save()

        Notification.objects.create(
            message=f"You have been added to the project '{project.project_title}'.",
            recipient_member=member,  
            notification_type="Member Added"
        )
        
        return Response({"message": "Member added successfully."}, status=200)
    except Members.DoesNotExist:
        return Response({"error": "Member not found."}, status=404)
    except Proj.DoesNotExist:
        return Response({"error": "Project not found."}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": "An unexpected error occurred."}, status=500)


@api_view(['POST'])
def retrieve_all_members(req):
    data = req.data

    try:
        all_members = Members.objects.filter(manager_id = data.get('manager')).values()
        return Response(list(all_members), status=200)
    except Exception as e:
        print(e) 
        Response(status=404)


@api_view(['POST'])
def get_mem_proj(req):

    data = req.data 

    try:
        mems = Members.objects.filter( member_project__project_id = data.get('projectID')).select_related('project')
        members_list = [
            {
                'firstname': mem.firstname,
                'lastname': mem.lastname,
                'email': mem.email,
                'username': mem.username,
            }
            for mem in mems
        ]
        return Response(members_list, status=200)

    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
@csrf_exempt
def del_memss(req):
    data = req.data 

    try:
        del_mem = Member_Project.objects.filter(username=data.get('username'), project_id=data.get('projID'))
        del_mem.delete()
        del_task = Tasks.objects.filter(assigned = data.get('username'), project_id = data.get('projID'))
        del_task.delete()
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
def update_project_description(req):
    data = req.data 

    try:
        project = Proj.objects.get(project_id=data.get('project_id'))
        project.project_description = data.get('project_description')
        project.save()
        return Response (status=200)

    except Exception as e:
        print(e)
        return Response(status=404)
    
    
@api_view(['POST'])
def update_task_date_gant(req):
    data = req.data

    try:
        task = Tasks.objects.get(task_id=data.get('task_id'))
        task.feature = data.get('feature')
        task.starting_date = data.get('starting_date')
        task.deadline = data.get('deadline')

        task.save()


    except Exception as e:
        print(e)
        return Response(status=404)  

@api_view(['POST']) 
def retrieve_project_description(req):
    data = req.data
    try:
        project = Proj.objects.get(project_id=data.get('project_id'))
        return Response({"project_description": project.project_description}, status=200)
    except Proj.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_notifications(req, username):
    try:
        member = Members.objects.get(username=username)

        notifications = Notification.objects.filter(recipient_member_id=member)

        notifications_data = [
            {
                'notification_id': notif.notification_id,
                'message': notif.message,
                'created_at': notif.created_at.strftime('%Y-%m-%d %H:%M:%S') 
            }
            for notif in notifications
        ]
        
        return Response(notifications_data, status=200)
    
    except Members.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)



@api_view(['POST'])
def filter_tasks(req):
    data = req.data
    try:
        start_date = data.get('start_date', None)
        end_date = data.get('end_date', None)
        project_id = data.get('project_id', None)
        assigned_member = data.get('assigned', None)
        status = data.get('status', None)
        priority = data.get('priority', None)
        sprint = data.get('sprint', None)  # Get sprint filter if provided
        
        tasks = Tasks.objects.all()
        
        if project_id:
            tasks = tasks.filter(project_id=project_id)
        
        if assigned_member:
            tasks = tasks.filter(assigned=assigned_member)
        
        if status:
            tasks = tasks.filter(status=status)
        
        if priority:
            tasks = tasks.filter(priority=priority)
        
        if sprint:  # Add sprint filter
            tasks = tasks.filter(sprint=sprint)
        
        if start_date and end_date:
            tasks = tasks.filter(starting_date__gte=start_date, deadline__lte=end_date)
        
        task_list = tasks.values('task_id', 'feature', 'status', 'assigned', 'sprint', 'priority', 'starting_date', 'deadline')
        return Response(list(task_list), status=200)
    
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def generate_report(req):
    user = req.user
    full_name = f"{user.first_name} {user.last_name}"  

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        manager = Project.objects.get(username=user.username)
        role = 'Manager'
    except Project.DoesNotExist:

        try:
            member = Members.objects.get(username=user.username)
            role = 'Member'
        except Members.DoesNotExist:
            role = 'Unknown'

    return Response({
        'full_name': full_name,
        'role': role,
        'timestamp': timestamp,
    })