import os

DJANGO_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
)

THIRD_PARTY_APPS = (
    'gunicorn',
    'spurl',
    'ckeditor',
    'sorl.thumbnail',
    'constance',
    'constance.backends.database',
    'storages',
    'file_resubmit',
)

PROJECT_APPS = (
    'common',
    'blog',
)

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PROJECT_APPS

