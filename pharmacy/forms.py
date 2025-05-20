from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field
from .models import Medicine, UserProfile
import datetime


class MedicineForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.form_method = "post"
        self.helper.label_class = "font-bold text-gray-700"  
        self.helper.layout = Layout(
            Field("name", wrapper_class="mb-4"),
            Field("batch_number", wrapper_class="mb-4"),
            Field("manufacturer", wrapper_class="mb-4"),
            Field("category", wrapper_class="mb-4"),
            Field("description", wrapper_class="mb-4"),
            Field("price", wrapper_class="mb-4"),
            Field("quantity", wrapper_class="mb-4"),
            Field("manufactured_date", wrapper_class="mb-4"),
            Field("expiry_date", wrapper_class="mb-4"),
            Field("image_upload", wrapper_class="mb-4"),
            Field("supplier", wrapper_class="mb-4"),
        )

    class Meta:
        model = Medicine
        fields = "__all__"
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter medicine name",
                }
            ),
            "batch_number": forms.TextInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter batch number",
                }
            ),
            "manufacturer": forms.TextInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter manufacturer name",
                }
            ),
            "supplier": forms.Select(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4"
                }
            ),
            "category": forms.Select(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4"
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter description",
                    "rows": 2,
                }
            ),
            "price": forms.NumberInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter price",
                }
            ),
            "quantity": forms.NumberInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "placeholder": "Enter quantity",
                }
            ),
            "manufactured_date": forms.DateInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "type": "date",
                }
            ),
            "expiry_date": forms.DateInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4",
                    "type": "date",
                }
            ),
            "image_upload": forms.ClearableFileInput(
                attrs={
                    "class": "form-control px-2 py-1 ring ring-secondary/70 focus:ring-secondary focus:outline-secondary rounded  block w-full mt-1 mb-4"
                }
            ),
        }
        labels = {
            "name": "Medicine Name",
            "batch_number": "Batch Number",
            "manufacturer": "Manufacturer",
            "category": "Category",
            "description": "Description",
            "price": "Price",
            "quantity": "Quantity",
            "manufactured_date": "Manufactured Date",
            "expiry_date": "Expiry Date",
        }

    def clean_price(self):
        price = self.cleaned_data.get("price")
        if price <= 0:
            raise forms.ValidationError("Price must be a positive number.")
        return price

    def clean_quantity(self):
        quantity = self.cleaned_data.get("quantity")
        if quantity <= 0:
            raise forms.ValidationError("Quantity must be a positive number.")
        return quantity

    def clean_expiry_date(self):
        expiry_date = self.cleaned_data.get("expiry_date")
        if expiry_date < datetime.date.today():
            raise forms.ValidationError("Expiry date cannot be in the past.")
        return expiry_date

    def clean_manufactured_date(self):
        manufactured_date = self.cleaned_data.get("manufactured_date")
        if manufactured_date > datetime.date.today():
            raise forms.ValidationError("Manufactured date cannot be in the future.")
        return manufactured_date



class ProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = '__all__'
        
        