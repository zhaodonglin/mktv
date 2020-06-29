# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Category, Post, Comment


class PostAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'user_name', 'time_stamp', 'featured', ]
    list_filter = ['featured', 'category', ]
    search_fields = ('name', 'text')


admin.site.register(Category)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
