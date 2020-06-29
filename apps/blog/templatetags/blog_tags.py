# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import template

from blog.models import Category


register = template.Library()


@register.inclusion_tag('blog/tags/categories.html')
def display_categories():
    return {'categories': Category.objects.all()}


@register.inclusion_tag('blog/tags/categories.html')
def display_category_right(category):
    return {'categories': Category.objects.all(),
            'category': category}
