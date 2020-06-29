# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
import sys
import os
import hashlib
import random
import StringIO
from PIL import Image
from django.contrib.sites.models import Site
from django.contrib.auth import login, logout
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core import urlresolvers
from django.test import TestCase

# The following is for NoDatabaseMixin and FastTestRunner
from django.test import TransactionTestCase
from django.test.runner import DiscoverRunner as BaseRunner
from mock import patch

from constance import config
from user_agents import parse

mailchimp_logger = logging.getLogger('mailchimp')

storage_factory = lambda root, url: FileSystemStorage(location=root, base_url=url)

def get_temporary_image(ext='jpg'):
    io = StringIO.StringIO()
    size = (200, 200)
    color = (255, 0, 0, 0)
    image = Image.new("RGBA", size, color)
    image.save(io, format='JPEG')
    name = 'test.{}'.format(ext)
    image_file = InMemoryUploadedFile(io, None, name, 'jpeg', io.len, None)
    image_file.seek(0)
    return image_file


def image_path(instance, filename):
    """Generates likely unique image path using md5 hashes"""
    filename, ext = os.path.splitext(filename.lower())
    instance_id_hash = hashlib.md5(str(instance.id)).hexdigest()
    filename_hash = ''.join(random.sample(hashlib.md5(filename.encode('utf-8')).hexdigest(), 8))
    return '{}/{}{}'.format(instance_id_hash, filename_hash, ext)


def random_with_n_digits(n):
    range_start = 10 ** (n - 1)
    range_end = (10 ** n) - 1
    return random.randint(range_start, range_end)


def crop_upload_to(instance, filename, crop_name):
    """
    Default function to specify a location to save crops to.

    :param instance: The model instance this crop field belongs to.
    :param filename: The image's filename this crop field operates on.
    :param crop_name: The crop name used when :attr:`CropFieldDescriptor.crop` was
        called.
    """
    filename, ext = os.path.splitext(os.path.split(filename)[-1])
    return os.path.join('crops', '%s-%s%s' % (filename, crop_name, ext))


def get_key_by_value(init_list, init_value):
    for key, value in init_list:
        if value == init_value:
            return key


# The following (NoDatabaseMixin, FastTestRunner) is for allowing tests that can skip
# generating the database (for speed)
# modified from https://www.caktusgroup.com/blog/2013/10/02/skipping-test-db-creation/
class NoDatabaseMixin(object):
    """
    Test runner mixin which skips the DB setup/teardown
    when there are no subclasses of TransactionTestCase to improve the speed
    of running the tests.
    """

    def build_suite(self, *args, **kwargs):
        """
        Check if any of the tests to run subclasses TransactionTestCase.
        """
        suite = super(NoDatabaseMixin, self).build_suite(*args, **kwargs)
        self._needs_db = any([isinstance(test, TransactionTestCase) for test in suite])
        return suite

    def setup_databases(self, *args, **kwargs):
        """
        Skip test creation if not needed. Ensure that touching the DB raises and
        error.
        """
        if self._needs_db:
            return super(NoDatabaseMixin, self).setup_databases(*args, **kwargs)
        if self.verbosity >= 1:
            print 'No DB tests detected. Skipping Test DB creation...'
        self._db_patch = patch('django.db.backends.utils.CursorWrapper')
        self._db_mock = self._db_patch.start()
        self._db_mock.side_effect = RuntimeError('No testing the database!')
        return None

    def teardown_databases(self, *args, **kwargs):
        """
        Remove cursor patch.
        """
        if self._needs_db:
            return super(NoDatabaseMixin, self).teardown_databases(*args, **kwargs)
        self._db_patch.stop()
        return None


class FastTestRunner(NoDatabaseMixin, BaseRunner):
    """Actual test runner sub-class to make use of the mixin."""


def required(wrapping_functions, patterns_rslt):
    """
    Example:
      from functools import partial

      urlpatterns = required(
          partial(login_required,login_url='/accounts/login/'),
          patterns(...)
      )
    """
    if not hasattr(wrapping_functions, '__iter__'):
        wrapping_functions = (wrapping_functions,)

    return [
        _wrap_instance__resolve(wrapping_functions, instance)
        for instance in patterns_rslt
    ]


def _wrap_instance__resolve(wrapping_functions, instance):
    if not hasattr(instance, 'resolve'):
        return instance
    resolve = getattr(instance, 'resolve')

    def _wrap_func_in_returned_resolver_match(*args, **kwargs):
        rslt = resolve(*args, **kwargs)

        if not hasattr(rslt, 'func'):
            return rslt
        f = getattr(rslt, 'func')

        for _f in reversed(wrapping_functions):
            # @decorate the function from inner to outter
            f = _f(f)

        setattr(rslt, 'func', f)

        return rslt

    setattr(instance, 'resolve', _wrap_func_in_returned_resolver_match)

    return instance


def intersect(a, b):
    """
    Finds the intersection of two dictionaries.

    A key and value pair is included in the result only if the key exists in both given dictionaries. Value is taken from
    the second dictionary.
    """

    return dict(filter(lambda (x, y): x in a, b.items()))


def mail_for_moderation(obj):
    # url_to_res = 'admin:{}_{}_change'.format(obj._meta.app_label, obj._meta.object_name.lower())
    url_to_res = 'admin:moderation_{}moderation_change'.format(obj._meta.object_name.lower())
    try:
        change_url = urlresolvers.reverse(url_to_res, args=(obj.id,))
    except urlresolvers.NoReverseMatch:
        url_to_res = 'admin:moderation_{}{}moderation_change'.format(obj._meta.app_label, obj._meta.object_name.lower())
        change_url = urlresolvers.reverse(url_to_res, args=(obj.id,))
    text = 'Object can be found at {}{}'.format(settings.DOMAIN, change_url)
    send_mail('Object for moderation was added', text, from_email=settings.DEFAULT_FROM_EMAIL,
              recipient_list=[a[1] for a in settings.ADMINS], fail_silently=True)


def mail_for_admin(subj, text):
    send_mail(subj, text, from_email=settings.DEFAULT_FROM_EMAIL,
              recipient_list=[config.ADMIN_EMAIL, ], fail_silently=True)


def get_user_agent(request):
    user_agent_string = request.META.get('HTTP_USER_AGENT', '')
    user_agent = parse(user_agent_string)
    return user_agent


def get_absolute_url(local_path):
    protocol = 'https' if getattr(settings, 'SECURE_SSL_REDIRECT', False) else 'http'
    url = '{protocol}://{host}{path}'.format(
        protocol=protocol,
        host=Site.objects.get_current().domain,
        path=local_path)
    return url

def keep_vars_in_session(view_func, vars):
    def wrap(request, *args, **kwargs):
        session_backup = {}
        for var in vars:
            try:
                session_backup[var] = request.session[var]
            except KeyError:
                pass
        response = view_func(request, *args, **kwargs)
        for var, value in session_backup.items():
            request.session[var] = value
        return response
    wrap.__doc__ = view_func.__doc__
    wrap.__name__ = view_func.__name__
    return wrap

def get_random_from_qs(qs, count):
    ids = qs.values_list('id', flat=True)
    sample = random.sample(ids, min(len(ids), count))
    return qs.model.objects.filter(id__in=sample)

def is_mainsubpage_request(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'MainSubPage'

