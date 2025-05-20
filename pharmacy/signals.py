from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, UserRole

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Get the default role (Cashier if no other role specified)
        default_role = UserRole.objects.filter(name='cashier').first()
        if not default_role:
            default_role = UserRole.objects.first()  # Fallback to any available role
        
        UserProfile.objects.create(
            user=instance,
            role=default_role,
            position='Staff Member'  # Default position
        )
    else:
        instance.profile.save()