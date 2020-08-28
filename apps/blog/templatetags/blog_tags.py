# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import template

from blog.models import Category


register = template.Library()


@register.inclusion_tag('blog/tags/categories.html')
def display_categories():
    return {'categories': Category.objects.all().filter(parent=None)}


def get_show_category(categories, category):
    parent=None
    category_name=None
    cur_category = categories.filter(name=category)
    if cur_category[0].parent is None:
        parent = cur_category[0]
        category_name = "All"
    else:
        parent = cur_category[0].parent
        category_name = cur_category[0].name
    return parent, category_name


@register.inclusion_tag('blog/tags/categories_head.html')
def display_category_head(category):
    categories = Category.objects.all()
    show_category, show_category_name = get_show_category(categories, category)

    return {'categories': categories.filter(parent=show_category),
            'category': show_category,
            'category_name': show_category_name}


@register.inclusion_tag('blog/tags/categories.html')
def display_category_right(category):
    categories = Category.objects.all()
    show_category, _ = get_show_category(categories, category)
    return {'categories': categories.filter(parent=None),
            'category': show_category}


@register.inclusion_tag('blog/tags/category_title.html')
def display_category_title(category):
    categories = Category.objects.all()
    show_category, _ = get_show_category(categories, category)
    return {'title':show_category.name}