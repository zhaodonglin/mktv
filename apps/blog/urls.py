# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import url

from blog.views import MainPageView, PostListView, PostDetailView, CommentListView, CommentAddView


urlpatterns = [
    url(r'^$', MainPageView.as_view(), name='main'),
    url(r'^category/(?P<slug>[-\w]+)/$', PostListView.as_view(), name='post_list'),
    url(r'^post/(?P<pk>[\d]+)/$', PostDetailView.as_view(), name='post_detail'),
    url(r'^post/(?P<post_id>[\d]+)/comments/$', CommentListView.as_view(), name='comment_list'),
    url(r'^post/(?P<post_id>[\d]+)/comment/add/$', CommentAddView.as_view(), name='add_comment'),
]
