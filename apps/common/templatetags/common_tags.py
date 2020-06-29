# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import re
import random

from django import template
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.sites.models import Site
from django.utils.safestring import mark_safe
from django.contrib import messages
from django.utils.timesince import timeuntil
from django.template.exceptions import TemplateSyntaxError
from django.template.loader import get_template
from django.core.cache import cache

from blog.models import Post

register = template.Library()


@register.inclusion_tag('common/tags/latest_blogs.html')
def display_latest_blog_posts():
    return {'posts': Post.objects.order_by('time_stamp')[:2]}


@register.filter
def timeuntil_day_only(value):
    res_str = timeuntil(value)
    if not ',' in res_str:
        res_str = 1
    else:
        res_str = res_str.encode('ascii', 'ignore')[0]
    return res_str


@register.filter
def paragraphs(value):
    """
    Turns paragraphs delineated with newline characters into
    paragraphs wrapped in <p> and </p> HTML tags.
    """
    paras = re.split(r'[\r\n]+', value)
    paras = ['<p>%s</p>' % p.strip() for p in paras]
    return '\n'.join(paras)


@register.simple_tag(takes_context=True)
def build_object_absolute_uri(context, obj):
    if obj and context.get('request'):
        request = context['request']
        return request.build_absolute_uri(obj.get_absolute_url())
    return ''


@register.simple_tag
def get_messages_level_json():
    messages_dict = messages.DEFAULT_TAGS.copy()
    messages_dict[messages.INFO] = 'information'
    return mark_safe(json.dumps(messages_dict))


@register.simple_tag(takes_context=True)
def get_site_domain(context):
    domain = context.get('domain')
    if domain:
        return domain
    site = context.get('site')
    if not site:
        request = context.get('request')
        if request:
            site = get_current_site(request)
        else:
            site = Site.objects.get_current()
    if hasattr(site, 'domain'):
        return site.domain
    return 'MuslimKids.tv'


@register.filter
def shuffle(arg):
    tmp = list(arg)[:]
    random.shuffle(tmp)
    return tmp


@register.filter
def to_int(value):
    return int(value)


