from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TableProperty, User, Course, School, Teacher, Enrollment, Recommendation, Top10RecommededField

@api_view(['GET'])
def get_data_propertise(request):
    data = list(TableProperty.objects.all().values())
    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": data
    })
    
@api_view(['GET'])
def get_user_datainfo(request):
    users = User.objects.all()[:20]
    enrolled_courses = list(Enrollment.objects.all().values())

    user_data = []
    for user in users:
        user_dict = user.__dict__.copy()
        user_dict.pop('_state', None)  # Xóa thông tin nội bộ của Django

        # Nếu chưa có trường `enrollment_count`, thì tính và lưu
        if not hasattr(user, 'enrollment_count') or user.enrollment_count is None:
            count = sum(1 for enrollment in enrolled_courses if enrollment['user_id'] == user.user_id)
            user.enrollment_count = count
            user.save(update_fields=['enrollment_count'])  # Lưu lại vào DB
            user_dict['enrollment_count'] = count
        else:
            user_dict['enrollment_count'] = user.enrollment_count

        user_data.append(user_dict)

    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": user_data
    })


    
@api_view(['GET'])
def get_course_datainfo(request):
    data = list(Course.objects.all().values())
    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": data
    })

@api_view(['GET'])
def get_school_datainfo(request):
    data = list(School.objects.all().values())
    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": data
    })
# Create your views here.

@api_view(['GET'])
def get_teacher_datainfo(request):
    data = list(Teacher.objects.all().values())
    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": data
    })

@api_view(['GET'])
def get_enrollment_for_user(request, user_id):
    # Lấy danh sách khóa học mà user đã enroll
    enrollments = list(
        Enrollment.objects.filter(user_id=user_id)
        .values("course_id", "enroll_time")
    )

    # Lấy thông tin tất cả các course
    course_ids = [e["course_id"] for e in enrollments]
    course_info = {
        course["course_id"]: course
        for course in Course.objects.filter(course_id__in=course_ids).values("course_id", "course_name", "course_about")
    }

    # Ghép thông tin khóa học vào enrollment
    for e in enrollments:
        course = course_info.get(e["course_id"])
        if course:
            e["course_name"] = course["course_name"]
            e["course_about"] = course["course_about"]

    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": enrollments
    })

@api_view(['GET'])
def get_recommendation_for_user(request, user_id):
    # Lấy bản ghi recommendation (với course_id là list)
    rec_entry = Recommendation.objects.filter(user_id=user_id).first()

    if not rec_entry:
        return Response({
            "message": f"Không tìm thấy recommendation cho user_id = {user_id}",
            "data": []
        })

    # Unwrap danh sách course_id
    course_ids = rec_entry.course_id  # vì là list trong JSONField
    print("Danh sách course_id:", course_ids)

    # Lấy thông tin khóa học
    course_data = list(
        Course.objects.filter(course_id__in=course_ids)
        .values("course_id", "course_name", "course_about", "school_id")
    )
    course_info = {course["course_id"]: course for course in course_data}

    # Lấy danh sách school_id từ tất cả course
    all_school_ids = set()
    for course in course_data:
        if isinstance(course.get("school_id"), list):
            all_school_ids.update(course["school_id"])

    school_data = {
        school["school_id"]: school["school_name"]
        for school in School.objects.filter(school_id__in=all_school_ids)
        .values("school_id", "school_name")
    }

    # Tổng hợp kết quả
    results = []
    for cid in course_ids:
        course = course_info.get(cid)
        if course:
            results.append({
                "course_id": cid,
                "course_name": course.get("course_name", ""),
                "course_about": course.get("course_about", ""),
                "school_name": [
                    school_data[sid] for sid in course.get("school_id", []) if sid in school_data
                ]
            })

    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": results
    })

@api_view(['GET'])
def get_all_course_info(request):
    '''
    Lấy thông tin tất cả các khóa học: tên, mô tả, số đăng ký, số khuyến nghị, tên trường học.
    Nếu chưa có enrollment_count hoặc recommendation_count trong Course, sẽ tính và cập nhật lại.
    '''
    all_courses = Course.objects.all().values()[:20]  # Lấy 20 khóa học đầu tiên
    results = []
    # print("Datatype of all_courses:", type(all_courses))
    for course in all_courses:
        course_id = course["course_id"]

        # Kiểm tra có trường enroll/recommend count chưa (MongoDB: field có tồn tại không)
        if "enrollment_count" in course and course["enrollment_count"] is not None:
            enrollment_count = course["enrollment_count"]
        else:
            enrollment_count = Enrollment.objects.filter(course_id=course_id).count()
            Course.objects.filter(course_id=course_id).update(enrollment_count=enrollment_count)

        if "recommendation_count" in course and course["recommendation_count"] is not None:
            recommendation_count = course["recommendation_count"]
        else:
            # course_id trong Recommendation là list -> kiểm tra phần tử trong list
            recommendation_count = Recommendation.objects.filter(course_id__contains=course_id).count()
            Course.objects.filter(course_id=course_id).update(recommendation_count=recommendation_count)

        # Lấy school_name từ school_id
        school_name = ""
        school_ids = course.get("school_id", [])
        if "school_id" in course and course["school_id"]:
            school_names = School.objects.filter(school_id__in=school_ids).values_list("school_name", flat=True)
            school_name = ", ".join(school_names)

        # Lấy teacher_name từ teacher_id
        teacher_name = ""
        teacher_ids = course.get("teacher_id", [])
        if "teacher_id" in course and course["teacher_id"]:
            teacher_names = Teacher.objects.filter(teacher_id__in=teacher_ids).values_list("teacher_name", flat=True)
            teacher_name = ", ".join(teacher_names)

         # Lấy trường course_field và chuyển thành chuỗi

        course_field_list = course.get("course_field", [])
        course_field_str = ", ".join(course_field_list) if isinstance(course_field_list, list) else ""


        results.append({
            "course_id": course_id,
            "course_name": course.get("course_name", "").title(),
            "course_about": course.get("course_about", "").capitalize(),
            "enrollment_count": enrollment_count,
            "course_field": course_field_str.title(),
            "recommendation_count": recommendation_count,
            "school_name": school_name.title(),
            "teacher_name": teacher_name.title()
        })

    return Response({
        "message": "Thông tin tất cả các khóa học",
        "data": results
    })

@api_view(['GET'])
def get_top10recommendedfield(request):
    '''
    Lấy 10 field được khuyến nghị nhiều nhất từ Top10RecommededField
    '''
    data = list(Top10RecommededField.objects.all().values())
    # thêm bước chuyển đổi "course_field" từ "computer science and technology" 
    # thành "Computer Science and Technology" sau đó upadate lại vào MongoDB
    for item in data:
        if "course_field" in item:
            item["course_field"] = item["course_field"].title()
    # Cập nhật lại vào MongoDB
    for item in data: 
        Top10RecommededField.objects.filter(course_field=item["course_field"]).update(
            course_field=item["course_field"]
        ) 
    if not data:
        return Response({
            "message": "Không có dữ liệu khuyến nghị nào",
            "data": []
        })
    return Response({
        "message": "Dữ liệu từ MongoDB:",
        "data": data
    })
