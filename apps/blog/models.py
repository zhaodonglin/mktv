# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from mptt.models import MPTTModel, TreeForeignKey

from ckeditor.fields import RichTextField
from sorl.thumbnail import ImageField, get_thumbnail

from common.utils import storage_factory, image_path


avatar_storage = storage_factory(
    settings.AVATAR_ROOT,
    settings.AVATAR_URL)

thumbnail_storage = storage_factory(
    settings.THUMBNAIL_ROOT,
    settings.THUMBNAIL_URL)


class Category(MPTTModel):
    name = models.CharField(max_length=255, verbose_name=_('name'))
    slug = models.SlugField(unique=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
    thumbnail = ImageField(verbose_name=_('category_img'), upload_to=image_path, storage=thumbnail_storage, null=True, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = (('parent', 'slug',))
        verbose_name = _('Category')
        verbose_name_plural = _('Category')

    @models.permalink
    def get_absolute_url(self):
        return 'blog:post_list', (), {'slug': self.slug}

    def get_single_page_url(self):
        return '/main/#blog-post-list?category_id=' + str(self.slug)

    def get_color(self):
        print self.name
        if 'Latest' in self.name:
            return 'red'
        elif 'Kids' in self.name:
            return 'blue'
        elif 'Teachers' in self.name:
            return 'yellow'

    def get_img(self):
        if self.thumbnail:
            # return get_thumbnail(self.thumbnail, '300x226', crop="center").url
            return get_thumbnail(self.thumbnail, '250x250', crop="center").url
        if 'Latest' in self.name:
            return 'img/latest-news.png'
        elif 'Kids' in self.name:
            return 'img/category-kids.png'
        elif 'Teachers' in self.name:
            return 'img/category-teachers.png'
    
    class MPTTMeta:
        order_insertion_by = ['name']

class PostManager(models.Manager):

    def featured(self):
        return self.get_queryset().filter(featured=True)


class Post(models.Model):
    name = models.CharField(max_length=255, verbose_name=_('name'))
    category = TreeForeignKey('Category',null=True,blank=True, verbose_name=_('category'), related_name='posts')
    user_name = models.CharField(verbose_name=_('author'), max_length=100)
    avatar = ImageField(verbose_name=_('avatar'), upload_to=image_path, storage=avatar_storage, null=True)
    short_description = models.CharField(verbose_name=_('short description'), max_length=200)
    text = RichTextField(verbose_name=_('text'))
    thumbnail = ImageField(
        verbose_name=_('thumbnail'), upload_to=image_path, storage=thumbnail_storage, null=True)
    time_stamp = models.DateTimeField(verbose_name=_('time stamp'), default=timezone.now)
    featured = models.BooleanField(verbose_name=_('featured'), default=False)

    objects = PostManager()

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = _('Post')
        verbose_name_plural = _('Post')
        ordering = ['-id']

    @models.permalink
    def get_absolute_url(self):
        return 'blog:post_detail', (), {'pk': self.id}

    def get_single_page_url(self):
        return '/main/#blog-post-details?post_id=' + str(self.id)

    @models.permalink
    def get_comment_form_url(self):
        return 'blog:add_comment', (), {'post_id': self.id}

    @models.permalink
    def get_comment_list_url(self):
        return 'blog:comment_list', (), {'post_id': self.id}

    def get_avatar_url(self):
        return get_thumbnail(self.avatar, '70x70', crop="center").url

    def big_thumbnail_url(self):
        return get_thumbnail(self.thumbnail, '760x379', crop="center").url

    def winner_thumbnail_url(self):
        return get_thumbnail(self.thumbnail, '312x165', crop="center").url

    def thumbnail_url(self):
        return get_thumbnail(self.thumbnail, '329x174', crop="center").url

    def post_list_thumbnail_url(self):
        # return get_thumbnail(self.thumbnail, '290x217', crop="center").url
        return get_thumbnail(self.thumbnail, '250x250', crop="center").url

    def main_thumbnail_url(self):
        return get_thumbnail(self.thumbnail, '671x326', crop="center").url

    @property
    def comments_count(self):
        return self.comments.filter(visible=True).count()


class CommentManager(models.Manager):
    def get_queryset(self):
        return super(CommentManager, self).get_queryset().filter(deleted=False)


class Comment(models.Model):
    post = models.ForeignKey(Post, verbose_name=_('post'), related_name='comments')
    text = models.TextField(verbose_name=_('text'))
    time_stamp = models.DateTimeField(verbose_name=_('time stamp'), default=timezone.now)
    deleted = models.BooleanField(verbose_name=_('deleted'), default=False)
    visible = models.BooleanField(verbose_name=_('is visible'), default=True)

    objects = CommentManager()

    def __unicode__(self):
        return 'Comment on {}'.format(self.post)

    class Meta:
        verbose_name = _('Comment')
        verbose_name_plural = _('Comment')

