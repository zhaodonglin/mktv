# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import forms
from blog.models import Comment


class CommentAddForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text', 'post']
        widgets = {
            'text': forms.Textarea(attrs={'style': 'width:100%'})
        }
