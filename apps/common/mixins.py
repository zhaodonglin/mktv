# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
from django.core.urlresolvers import reverse_lazy, reverse
from django.http.response import HttpResponse, HttpResponseRedirect

from django.utils.decorators import method_decorator
from django.utils.translation import ugettext as _
from django.views.decorators.cache import never_cache

from common.decorators import ajax_required
from common.utils import is_mainsubpage_request


class AjaxRequiredMixin(object):
    """
    Mixin for AJAX requests
    """

    @method_decorator(ajax_required)
    def dispatch(self, *args, **kwargs):
        return super(AjaxRequiredMixin, self).dispatch(*args, **kwargs)


class AjaxableResponseMixin(object):
    """
    Mixin to add AJAX support to a form.
    Must be used with an object-based FormView (e.g. CreateView)
    """

    def render_to_json_response(self, context, **response_kwargs):
        data = json.dumps(context)
        response_kwargs['content_type'] = 'application/json'
        return HttpResponse(data, **response_kwargs)

    def get_response_valid_data(self, form):
        return {'pk': self.object.pk, }

    def get_response_invalid_data(self, form):
        return form.errors

    def form_invalid(self, form):
        response = super(AjaxableResponseMixin, self).form_invalid(form)
        if self.request.is_ajax():
            data = self.get_response_invalid_data(form)
            data.update()
            return self.render_to_json_response(data, status=400)
        else:
            return response

    def form_valid(self, form):
        if self.request.is_ajax():
            self.object = form.save()
            data = self.get_response_valid_data(form)
            return self.render_to_json_response(data)
        else:
            return super(AjaxableResponseMixin, self).form_valid(form)


class AjaxJSONResponseMixin(object):
    """
    Mixin to return JSON responses for AJAX requests

    """
    response_class = HttpResponse

    def render_to_response(self, context, **response_kwargs):
        response_kwargs['content_type'] = 'application/json'
        return self.response_class(
            self.convert_context_to_json(context),
            **response_kwargs)

    def convert_context_to_json(self, context):
        return json.dumps(context)

    @method_decorator(ajax_required)
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super(AjaxJSONResponseMixin, self).dispatch(*args, **kwargs)


class AjaxTemplateMixin(object):
    """
    Mixin to allow using a different template if the request is AJAX
    """

    def get_template_names(self):
        if self.request.is_ajax():
            return self.template_name_ajax
        return self.template_name


class RedirectToSPAMixin(object):
    def dispatch(self, request, *args, **kwargs):
        if not is_mainsubpage_request(request) and not request.is_ajax():
            return HttpResponseRedirect(self.get_spa_url())
        return super(RedirectToSPAMixin, self).dispatch(request, *args, **kwargs)
