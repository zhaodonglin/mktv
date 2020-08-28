# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Category, Post, Comment


class PostAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'user_name', 'time_stamp', 'featured', ]
    list_filter = ['featured', 'category', ]
    search_fields = ('name', 'text')
    list_editable = ('category',)


admin.site.register(Category, DraggableMPTTAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
