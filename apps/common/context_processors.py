# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings

def server_type(request):
    return {'server_type': settings.SERVER_TYPE}