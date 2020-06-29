from functools import partial
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.core.urlresolvers import reverse_lazy
from django.views.generic import TemplateView

from common.utils import required
from .views import MainView, MainpageView, page_not_found


handler404 = 'common.views.handler404'
handler500 = 'common.views.handler500'

admin.autodiscover()
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', MainView.as_view(), name='main'),
    url(r'^main/$', MainpageView.as_view(), name='single_page_main'),
    url(r'^blog/', include('blog.urls', 'blog')),
    url(r'^ckeditor/', include('ckeditor.urls')),
    url(r'^404/$', page_not_found),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
               + static(settings.STATIC_ROOT, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
