# pharmacy/urls.py

from django.urls import path
from pharmacy import views as view

urlpatterns = [
    path('', view.home, name='home'),  
    path('profile', view.profile, name='profile'),
    path('login', view.user_login, name='user_login'),
    path('logout', view.user_logout, name='user_logout'),
    path('medicines', view.medicine_list, name='medicines'),
]