# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _

from blog.factories import BlogPostFactory
from blog.models import Category, Post
from common.utils import BaseTestCase


class BlogMainViewTest(BaseTestCase):

    def setUp(self):
        self.create_init_data()
        self.url = reverse('blog:main')
        BlogPostFactory.create_batch(50)

    # def test_access(self):
    #     resp = self.client.get(self.url)
    #     self.assertRedirects(resp, '{}?next={}'.format(reverse('auth_login'), self.url))

    def test_categories(self):
        self.client.login(username='admin', password='admin')
        resp = self.client.get(self.url)
        categories = Category.objects.all()
        for category in categories:
            self.assertContains(resp, category.get_absolute_url())

    def test_featured(self):
         self.client.login(username='admin', password='admin')
         featured = Post.objects.featured()[:4]
         resp = self.client.get(self.url)
         for post in featured:
             self.assertContains(resp, post.get_absolute_url())


class BlogCategoryViewTest(BaseTestCase):

    def setUp(self):
        self.create_init_data()
        BlogPostFactory.create_batch(50)
        self.category = Category.objects.first()
        self.url = self.category.get_absolute_url()

    # def test_access(self):
    #     resp = self.client.get(self.url)
    #     self.assertRedirects(resp, '{}?next={}'.format(reverse('auth_login'), self.url))

    def test_categories(self):
        self.client.login(username='admin', password='admin')
        resp = self.client.get(self.url)
        categories = Category.objects.all()
        for category in categories:
            self.assertContains(resp, category.get_absolute_url())

    def test_posts(self):
        self.client.login(username='admin', password='admin')
        resp = self.client.get(self.url)
        posts = Post.objects.filter(category=self.category)
        for post in posts:
            self.assertContains(resp, post.get_absolute_url())


class BlogDetailViewTest(BaseTestCase):

    def setUp(self):
        self.create_init_data()
        posts = BlogPostFactory.create_batch(50)
        self.post = posts[0]
        self.url = self.post.get_absolute_url()

    # def test_access(self):
    #     resp = self.client.get(self.url)
    #     self.assertRedirects(resp, '{}?next={}'.format(reverse('auth_login'), self.url))

    def test_categories(self):
        self.client.login(username='admin', password='admin')
        resp = self.client.get(self.url)
        categories = Category.objects.all()
        for category in categories:
            self.assertContains(resp, category.get_absolute_url())

    def test_post(self):
        self.client.login(username='admin', password='admin')
        resp = self.client.get(self.url)
        self.assertContains(resp, self.post.name)
