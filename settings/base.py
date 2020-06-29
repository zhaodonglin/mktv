# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import sys
from unipath import Path


PROJECT_DIR = Path()


def rel(*x):
    return PROJECT_DIR.child(*x)


os.sys.path.insert(0, rel('apps'))

DOMAIN = 'muslimkids.tv'

DEBUG = False
SERVER_TYPE = 'PRODUCTION'

DEFAULT_FROM_EMAIL = 'info@muslimkids.tv'

ADMINS = (
    ('miloproductionsinc', 'miloproductionsinc@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mktv',
        'USER': 'webmaster',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['*']

TIME_ZONE = 'America/Chicago'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = True

USE_L10N = True

USE_TZ = True

PROJECT_ABS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA_ROOT = os.path.join(os.path.join(PROJECT_ABS_DIR, 'public'), 'media')

MEDIA_URL = '/media/'

STATIC_ROOT = rel('public', 'static')

STATIC_URL = '/static/'

STATICFILES_DIRS = ()

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

FILE_RESUBMIT_URL = os.path.join(os.path.join(MEDIA_ROOT, 'cache'), 'file_resubmit')

FILE_UPLOAD_MAX_MEMORY_SIZE = 200000000
FILE_UPLOAD_PERMISSIONS = 0o644

CACHES = {
    'default': {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        }
    },
    "file_resubmit": {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        "LOCATION": FILE_RESUBMIT_URL
    },
}

TEMPLATES = [
    {
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        'DIRS': [
            os.path.join(rel('apps', 'common'), 'templates'),
        ],
        'OPTIONS': {
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
            'debug': DEBUG,
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                # Your stuff: custom template context processors go here
                'constance.context_processors.config',
                'common.context_processors.server_type'
            ],
        },
    },
]

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'common.urls'

WSGI_APPLICATION = 'wsgi.application'

LOG_FILE = rel('logs', 'app.log')


# Configure files path settings
THUMBNAIL_ROOT = os.path.join(MEDIA_ROOT, 'thumbnails')
THUMBNAIL_URL = os.path.join(MEDIA_URL, 'thumbnails/')

IMAGE_ROOT = os.path.join(MEDIA_ROOT, 'images')
IMAGE_URL = os.path.join(MEDIA_URL, 'images/')

AVATAR_ROOT = os.path.join(MEDIA_ROOT, 'avatars')
AVATAR_URL = os.path.join(MEDIA_URL, 'avatars/')

NO_AVATAR_URL = os.path.join(STATIC_URL, 'img/no_avatar_small.jpg')
NO_AVATAR_CHILD_URL = os.path.join(STATIC_URL, 'img/def-child-avatar.png')
NO_AVATAR_PARENT_URL = os.path.join(STATIC_URL, 'img/def-parent-avatar.png')
NO_AVATAR_MOBILE_URL = os.path.join(STATIC_URL, 'img/def-avatar-mobile.png')

# CKeditor settings
CKEDITOR_UPLOAD_PATH = os.path.join(MEDIA_ROOT, 'ckeditor')

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': [
            {'name': 'all',
             'items': [
                 'Bold', 'Underline', 'Italic', 'RemoveFormat', '-', 'Image', 'Smiley', 'Youtube', 'HorizontalRule',
                 'Link', 'Unlink', 'Source', 'NumberedList', 'BulletedList', 'TextColor', 'Font', 'FontSize',
                 'ShowBlocks', 'Styles', 'Format'
             ]}
        ],
        'width': '1140px',

    },
    'book_page': {
        'toolbar': [
            {'name': 'all',
             'items': [
                 'Bold', 'Underline', 'Italic', 'RemoveFormat', 'TextColor', 'Font', 'Format', '-',
                 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
                 'Image', 'HorizontalRule', 'Smiley', 'Youtube', 'Link', 'Unlink', 'Source', '-',
                 'ShowBlocks'

             ]}
        ],
        'width': '490px',
        'height': '679px',
        'contentsCss': ['/static/css/book.css', '/static/css/fonts.css', '/static/bootstrap/css/bootstrap.min.css'],

    },
}

# Django select2 settings
SELECT2_BOOTSTRAP = True

# constance settings

CONSTANCE_CONFIG = {
    'PHONE': ('+1 306 261 4924', 'the phone number'),
    'ADDRESS': ('621 McDonough Link NW Edmonton, AB Canada', 'address'),
    'FB_URL': ('http:\\\\facebook.com', 'Facebook url'),
    'TW_URL': ('http:\\\\twitter.com', 'Twitter url'),
    'G_PLUS_URL': ('http:\\\\plus.google.com', 'g+ url'),
    'PR_URL': ('http:\\\\pinterest.com', 'Pinterest url'),
    'IG_URL': ('https:\\\\instagram.com/muslimkids.tv/', 'Instagram url'),
    'YT_URL': ('https:\\\\youtube.com/user/miloproductionsinc', 'Youtube url'),
    'CONTACT_EMAIL': ('Info@MuslimKids.TV', 'Contact email'),
    'CONTACT_FORWARD_EMAIL': ('miloproductionsinc@gmail.com', 'Contact foward email'),
    'ADMIN_EMAIL': ('miloproductionsinc@gmail.com', 'Admin email'),
    'SUPPORT_EMAIL': ('support@muslimkids.tv', 'Support email'),
    'SUGGESTION_EMAIL': ('support@muslimkids.tv', 'Suggestion email'),
}

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'

THUMBNAIL_PRESERVE_FORMAT = True

from .apps import *

from .logging import *

try:
    from .secrets import *

except ImportError:
    pass

try:
    from .local import *

except ImportError:
    pass
