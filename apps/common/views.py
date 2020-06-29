# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import

import base64
import json
import datetime
import logging
import csv
from random import choice

from django.core.mail import EmailMultiAlternatives
from django.contrib.messages import get_messages
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.generic import TemplateView, View, CreateView
from django.core.urlresolvers import reverse_lazy, reverse
from django.conf import settings
from django.views.generic.edit import FormView
from django.core.mail import mail_admins
from constance import config

from blog.models import Post
from common.utils import is_mainsubpage_request
from common.mixins import AjaxRequiredMixin


payment_logger = logging.getLogger('payment')
mailchimp_logger = logging.getLogger('mailchimp')


class MainView(TemplateView):
    template_name = 'index.html'

    def dispatch(self, request, *args, **kwargs):
	return HttpResponseRedirect(reverse('single_page_main'))


class MainpageView(TemplateView):
    template_name = 'main/base.html'


class JSONResponseView(View):
    """
    Allows rendering JSON response
    """

    def render_to_json_response(self, context, **response_kwargs):
        data = json.dumps(context)
        response_kwargs['content_type'] = 'application/json'
        return HttpResponse(data, **response_kwargs)


def handler404(request, **kwargs):
    # Overrides the default 404 handler so that we can control the response more finely
    status = kwargs.get('status', 404)
    context = {
        'is_mainsubpage': is_mainsubpage_request(request)
    }
    return render(request, '404.html', context=context, status=status)


def page_not_found(request):
    # This function is for the /404/ url
    # Since this will only be hit when someone actually requests /404/, the status returned is 200
    # (This is important for handling requests to MainSubPages that are unknown to main-config.js)
    return handler404(request, status=200)


def handler500(request):
    context = {
        'is_mainsubpage': is_mainsubpage_request(request)
    }
    return render(request, '500.html', context=context, status=500)
