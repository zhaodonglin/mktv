# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import random
import datetime

from django.utils import lorem_ipsum

import factory
from factory.fuzzy import FuzzyChoice
from pytz import utc
from uuslug import slugify
from blog.models import Comment
from common.factories import RandomImageField

from .models import Post, Category, Comment


class CategoryFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Category
    FACTORY_DJANGO_GET_OR_CREATE = ['name', ]

    @factory.lazy_attribute
    def name(self):
        return 'category-{0}'.format(random.randint(1, 3))

    slug = factory.LazyAttribute(lambda s: slugify(s.name[:50]))


class BlogPostFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Post
    FACTORY_DJANGO_GET_OR_CREATE = ['name', ]

    @factory.lazy_attribute
    def name(self):
        return 'post-{0}'.format(random.randint(1, 10))

    category = factory.SubFactory(CategoryFactory)

    user_name = factory.Sequence(lambda n: 'name-{}'.format(n))

    avatar = RandomImageField(width=78, height=78)

    text = factory.LazyAttribute(lambda s: lorem_ipsum.words(50, False))

    short_description = factory.LazyAttribute(lambda s: s.text[:200])

    thumbnail = RandomImageField(width=300, height=200)

    time_stamp = factory.fuzzy.FuzzyDateTime(datetime.datetime(2013, 1, 1, tzinfo=utc))

    featured = factory.fuzzy.FuzzyChoice([False, False, True])


class CommentFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Comment

    post = factory.SubFactory(BlogPostFactory)

    text = factory.LazyAttribute(lambda s: lorem_ipsum.words(50, False))

    time_stamp = factory.fuzzy.FuzzyDateTime(datetime.datetime(2010, 1, 1, tzinfo=utc))
