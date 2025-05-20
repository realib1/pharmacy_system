from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError

class UserRole(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('pharmacist', 'Pharmacist'),
        ('cashier', 'Cashier'),
        ('inventory', 'Inventory Manager'),
    ]

    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    permissions = models.TextField(help_text="Comma-separated list of permissions")
    description = models.TextField(blank=True)

    def __str__(self):
        return self.get_name_display()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(UserRole, on_delete=models.PROTECT)
    position = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=False)
    email_address = models.EmailField(max_length=250, blank=True)
    address = models.CharField(max_length=250, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.role}"

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_info = models.TextField()
    address = models.TextField()
      
    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    batch_number = models.CharField(max_length=255, unique=True)
    manufacturer = models.CharField(max_length=255)
    manufactured_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='medicines')
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True, blank=True)
    image_upload = models.ImageField(upload_to='medicines/', blank=True, null=True)

    def clean(self):
        if self.expiry_date <= self.manufactured_date:
            raise ValidationError("Expiry date must be after manufactured date.")
        if self.price <= 0:
            raise ValidationError("Price must be a positive number.")
        if self.quantity < 0:
            raise ValidationError("Quantity cannot be negative.")
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class MedicineSale(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity_sold = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    sold_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def total_amount(self):
        return self.quantity_sold * self.price_per_unit

    def __str__(self):
        return f"Sale of {self.medicine.name} on {self.date.strftime('%Y-%m-%d')}"