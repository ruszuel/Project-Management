from django.db import models

# Create your models here.

class Project(models.Model):
    manager_id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    username = models.CharField(max_length=30, unique=True)
    manager_email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    class Meta:
        db_table = 'users'
        managed = False

class Proj(models.Model):
    project_id = models.AutoField(primary_key=True, null=False)
    project_description = models.TextField(null=True, blank=True)
    project_title = models.CharField(max_length=100, null=False)
    manager = models.ForeignKey(Project, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'projects'
        managed = False

class Members(models.Model):
    member_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Proj, on_delete=models.CASCADE)
    manager = models.ForeignKey(Project, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    username = models.CharField(max_length=30, unique=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    class Meta:
        db_table = 'members'
        managed = False

class Tasks(models.Model):
    task_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Proj, on_delete=models.CASCADE)
    feature = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    assigned = models.CharField(max_length=255)
    sprint = models.IntegerField()
    priority = models.CharField(max_length=255)
    starting_date = models.DateField()
    deadline = models.DateField()

    class Meta:
        db_table = 'tasks'
        managed = False

class Member_Project(models.Model):
    assigned_projects_id = models.AutoField(primary_key=True)
    username = models.ForeignKey(Members,to_field='username', on_delete=models.CASCADE, db_column='username')
    project = models.ForeignKey(Proj, on_delete=models.CASCADE, db_column='project_id')

    class Meta:
        db_table = 'member_projects'
        managed = False


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    message = models.TextField()
    recipient_member = models.ForeignKey(Members, on_delete=models.CASCADE, null=True, blank=True, db_column='recipient_member', to_field='username')
    notification_type = models.CharField(max_length=50) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        managed = False