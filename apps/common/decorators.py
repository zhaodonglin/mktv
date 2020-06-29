# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import base64
import json

from functools import wraps
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect, render



def ajax_required(view_func):
    """
    View decorator that raises 400 if request was
    not POST or was made not using ajax.
    """
    @wraps(view_func)
    def wrapped_view_func(request, *args, **kwargs):
        if request.method == 'GET' and request.is_ajax():
            return view_func(request, *args, **kwargs)

        if request.method == 'POST' and request.is_ajax():
            return view_func(request, *args, **kwargs)

        return HttpResponseBadRequest()

    return wrapped_view_func


def json_response(view_func):
    """ View decorator that converts the result returned by a view function
        into a JSON response.
        ValueError and RuntimeError exceptions from the view function trigger
        a 400 status code and the error message returned in the JSON.
    """
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        try:
            response_data = view_func(request, *args, **kwargs)
            return JsonResponse(response_data)
        except (ValueError, RuntimeError) as exc:
            return JsonResponse({'message': exc.message}, status=400)
        # Other exceptions will result in 500
    return wrapped


def _get_cache_key(prefix, *args, **kwargs):
    hash_args_kwargs = hash(tuple(kwargs.iteritems()) + args)
    return '{}_{}'.format(prefix, hash_args_kwargs)


def cache_method(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        cache_key_prefix = '_cache_{}'.format(func.__name__)
        cache_key = _get_cache_key(cache_key_prefix, *args, **kwargs)
        if not hasattr(self, cache_key):
            setattr(self, cache_key, func(self))
        return getattr(self, cache_key)
    return wrapper


def get_or_default(func, default=None):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ObjectDoesNotExist:
            return default
    return wrapper

