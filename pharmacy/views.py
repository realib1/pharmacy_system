from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Medicine, UserProfile
from datetime import datetime

def get_base_context(request=None):
    now = datetime.now()
    context = {
        'day': now.strftime('%A'),
        'current_time': now.strftime('%I:%M %p'),
        'current_date': now.strftime('%B %d, %Y')
    }
    
    if request and request.user.is_authenticated:
        try:
            profile = request.user.profile
            context.update({
                'user_role': profile.role.get_name_display(),
                'user_position': profile.position,
                'user_department': profile.department
            })
        except UserProfile.DoesNotExist:
            context.update({
                'user_role': 'Guest',
                'user_position': '',
                'user_department': ''
            })
    
    return context


@login_required
def home(request):
    context = get_base_context(request)
    return render(request, 'base.html', context)


@login_required
def profile(request):
    context = get_base_context(request)
    context['user'] = request.user
    return render(request, 'pharmacy/profile.html', context)


def user_login(request):
    context = get_base_context(request)
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()
    context['form'] = form
    return render(request, 'layout/login.html', context)

def user_logout(request):
    auth_logout(request)
    messages.info(request, 'You have been logged out successfully.')
    return redirect('user_login')

@login_required
def medicine_list(request):
    context = get_base_context(request)
    context['medicines'] = Medicine.objects.all()
    return render(request, 'pharmacy/medicines.html', context)