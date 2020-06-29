try:
    from .base import LOG_FILE

except ImportError:
    LOG_FILE = None

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
        'simplified': {
            'format': "[%(asctime)s] - %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        }
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['null'],
            # 'handlers': ['mail_admins'],
            # 'level': 'ERROR',
            'level': 'INFO',
            'propagate': True,
        },
        'django': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'WARN',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}

if LOG_FILE:
    LOGGING['handlers']['logfile'] = {'level': 'DEBUG',
                                      'filters': ['require_debug_false'],
                                      'class': 'logging.handlers.RotatingFileHandler',
                                      'filename': LOG_FILE,
                                      'maxBytes': 50000,
                                      'backupCount': 2,
                                      'formatter': 'standard'}
    LOGGING['loggers']['django.request']['handlers'].append('logfile')
    LOGGING['loggers']['django']['handlers'].append('logfile')
