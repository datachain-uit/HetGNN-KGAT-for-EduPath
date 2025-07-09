from django.urls import path
from . import views

urlpatterns = [
    path("datapropertise/", views.get_data_propertise, name="get_data_propertise"),
    path("user/", views.get_user_datainfo, name="get_user_datainfo"),
    path("user/<str:user_id>/course", views.get_enrollment_for_user, name="get_enrollment_for_user"),
    path("user/<str:user_id>/recommendation", views.get_recommendation_for_user, name="get_recommendation_for_user"),
    path("course/", views.get_all_course_info, name="get_course_datainfo"),
    path("field/", views.get_top10recommendedfield, name="get_top10recommendedfield"),
]