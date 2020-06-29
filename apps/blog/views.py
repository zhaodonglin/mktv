# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http.response import Http404

from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.core.urlresolvers import reverse
from django.views.generic.base import TemplateView, View
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.list import ListView
from blog.forms import CommentAddForm

from blog.models import Post, Category, Comment
from common.mixins import AjaxRequiredMixin, AjaxableResponseMixin, AjaxTemplateMixin, RedirectToSPAMixin
from common.views import JSONResponseView


class MainPageView(RedirectToSPAMixin, AjaxTemplateMixin, ListView):
    template_name = 'blog/main.html'
    template_name_ajax = 'blog/main_list_ajax.html'
    model = Post
    paginate_by = 12

    def get_spa_url(self):
        return "{}#blog".format(reverse('single_page_main'))

    def get_queryset(self):
        try:
            self.feature_posts = Post.objects.featured()
            self.feature_post_ids = self.feature_posts.values_list('id', flat=True)
            if not self.feature_posts:
                recent_posts = Post.objects.order_by('-time_stamp')
            else:
                recent_posts = Post.objects.exclude(id__in=self.feature_post_ids).order_by('-time_stamp')
        except Post.DoesNotExist:
            raise Http404
        return recent_posts

    def get_context_data(self, **kwargs):
        context = super(MainPageView, self).get_context_data(**kwargs)
        context['feature_posts'] = self.feature_posts
        return context


class PostListView(RedirectToSPAMixin, ListView):
    model = Post
    paginate_by = 3
    category = None

    def get_template_names(self):
        if self.request.is_ajax():
            return ['blog/post_list_ajax.html']
        return super(PostListView, self).get_template_names()

    def get_spa_url(self):
        return "{}#blog-post-list?category_id={}".format(reverse('single_page_main'), self.kwargs['slug'])

    def get_queryset(self):
        queryset = super(PostListView, self).get_queryset()
        category = get_object_or_404(Category, slug=self.kwargs.get('slug'))
        self.category = category
        queryset = queryset.filter(category=self.category)

        return queryset

    def get_context_data(self, **kwargs):
        context = super(PostListView, self).get_context_data(**kwargs)
        context['category'] = self.category
        context['categories'] = Category.objects.all()
        return context


class PostDetailView(RedirectToSPAMixin, DetailView):
    model = Post
    template_name = 'blog/post_detail.html'

    def get_spa_url(self):
        return "{}#blog-post-details?post_id={}".format(reverse('single_page_main'), self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        data = super(PostDetailView, self).get_context_data(**kwargs)
        return data


class CommentListView(AjaxRequiredMixin, ListView):
    template_name = 'common/comments_form.html'
    template_name_ajax = 'common/comment_list_ajax.html'
    model = Comment
    context_object_name = 'comments'
    paginate_by = 5

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        try:
            self.post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise Http404
        return Comment.objects.filter(post_id=post_id, visible=True).order_by('-id')

    def get_context_data(self, **kwargs):
        context = super(CommentListView, self).get_context_data(**kwargs)
        context['post'] = self.post
        context['comment_form_url'] = self.post.get_comment_form_url()
        context['comment_list_url'] = self.post.get_comment_list_url()
        return context

    def get_template_names(self):
        if self.request.GET.get('page'):
            return self.template_name_ajax
        return self.template_name


class CommentAddView(AjaxableResponseMixin, AjaxRequiredMixin, CreateView):
    template_name = 'common/comment_add.html'
    form_class = CommentAddForm
    model = Comment

    def get_response_valid_data(self, form):
        return {'html': render_to_string('common/comment.html', {'comment': self.object})}

    def get_form_kwargs(self):
        kwargs = {'initial': self.get_initial()}
        if self.request.method in ('POST', 'PUT'):
            data = self.request.POST.copy()
            data.update({'post': self.post_obj.id})
            kwargs.update({
                'data': data,
                'files': self.request.FILES,
            })
        return kwargs

    def form_valid(self, form):
        response = super(CommentAddView, self).form_valid(form)
        return response

    def dispatch(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        try:
            self.post_obj = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise Http404
        return super(CommentAddView, self).dispatch(request, *args, **kwargs)

