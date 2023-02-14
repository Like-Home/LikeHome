from django.contrib import admin

from .models.todo import Todo


class TodoAdmin(admin.ModelAdmin):
    list = ('title', 'description', 'completed')


admin.site.register(Todo, TodoAdmin)
