# pharmacy/urls.py

from django.urls import path
from pharmacy import views as view

urlpatterns = [
    path('', view.home, name='home'),  
    path('profile', view.profile, name='profile'),
    path('login', view.user_login, name='user_login'),
    path('logout', view.user_logout, name='user_logout'),
    path('dashboard', view.dashboard, name='dashboard'),
    path('medicines', view.medicine_list, name='medicines'),
    path('medicines/add', view.add_medicine, name='add_medicine'),
    path('medicines/<int:medicine_id>/edit', view.edit_medicine, name='edit_medicine'),
    path('medicines/<int:medicine_id>/delete', view.delete_medicine, name='delete_medicine'),
    path('medicines/<int:medicine_id>/', view.medicine_details, name='medicine_details'),
     path('reports/pdf/', view.download_pdf_report, name='download_pdf_report'),
    path('reports/excel/', view.download_excel_report, name='download_excel_report'),
]