from django.contrib import admin

from .models.User import User
from .models.Booking import Booking


class UserAdmin(admin.ModelAdmin):
    list = ('id', 'email', 'travel_points', 'username', 'password', 'created_at')


admin.site.register(Booking)
admin.site.register(User)
