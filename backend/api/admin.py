from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models.Account import Account
from .models.Booking import Booking


class AccountInline(admin.StackedInline):
    model = Account
    can_delete = False
    verbose_name_plural = 'Accounts'


class MyUserAdmin(UserAdmin):
    inlines = (AccountInline, )


class BookingAdmin(admin.ModelAdmin):
    raw_id_fields = ('hotel', 'user')


admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)
admin.site.register(Booking, BookingAdmin)
