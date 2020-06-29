# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import sys

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Fill the database with test fixtures'

    def handle(self, *args, **options):
        sys.stdout.write('Starting fill db\r\n')

        site = Site.objects.get(pk=1)
        site.domain = site.name = settings.DOMAIN
        site.save()

        sys.stdout.write('Completed fill db\r\n')
