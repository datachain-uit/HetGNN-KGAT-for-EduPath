from djongo import models  # Sử dụng models từ djongo thay cho django.db

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name="notes")  # Chắc chắn rằng 'User' được tham chiếu đúng

    def __str__(self):
        return self.title


class TableProperty(models.Model):
    dataset_name = models.CharField(max_length=255, null=True, blank=True)
    File = models.CharField(max_length=255, null=True, blank=True)
    missing_value_rate = models.CharField(max_length=20, null=True, blank=True)
    num_rows = models.IntegerField(null=True, blank=True)
    num_column = models.IntegerField(null=True, blank=True)
    num_duplicates = models.IntegerField(null=True, blank=True)
    data_types = models.JSONField(null=True, blank=True) 

    class Meta:
        db_table = "table_properties"


class User(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True)
    user_name = models.CharField(max_length=100, unique=True)
    user_gender = models.CharField(max_length=10, null=True, blank=True)
    enrollment_count = models.IntegerField(default=0)
    class Meta:
        db_table = 'user'
class Course(models.Model):
    course_id = models.CharField(max_length=100, primary_key=True)
    course_name = models.CharField(max_length=100)
    course_prerequisites = models.TextField(null=True, blank=True)
    course_about = models.TextField(null=True, blank=True)
    course_field = models.JSONField(default=list)
    school_id = models.JSONField(default=list)
    teacher_id = models.JSONField(default=list)
    enrollment_count = models.IntegerField(default=0)
    recommendation_count = models.IntegerField(default=0)
    class Meta:
        db_table = 'course'

class School(models.Model):
    school_id = models.CharField(max_length=100, primary_key=True)
    school_name = models.CharField(max_length=100)
    school_about = models.TextField(null=True, blank=True)
    school_motto = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'school'

class Teacher(models.Model):
    teacher_id = models.CharField(max_length=100, primary_key=True)
    teacher_name = models.CharField(max_length=100)
    teacher_about = models.TextField(null=True, blank=True)
    teacher_job_title = models.CharField(max_length=100, null=True, blank=True)
    teacher_org_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'teacher'

class Enrollment(models.Model):
    user_id = models.CharField(max_length=100)
    course_id = models.CharField(max_length=100)
    enroll_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'enrolled'

class Recommendation(models.Model):
    user_id = models.CharField(max_length=100)
    course_id = models.JSONField(default=list)

    class Meta:
        db_table = 'recommendations'

class Top10RecommededField(models.Model):
    course_field = models.CharField(max_length=100, primary_key=True)
    count = models.IntegerField(default=0)

    class Meta:
        db_table = 'field'