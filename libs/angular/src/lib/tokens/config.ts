import {InjectionToken} from '@angular/core';
import {BrowserSentryClientOptions} from '@micro-sentry/browser';

export const MICRO_SENTRY_CONFIG = new InjectionToken<BrowserSentryClientOptions>(
    'Micro Sentry Options',
);
