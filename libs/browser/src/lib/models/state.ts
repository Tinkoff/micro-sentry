import {SentryRequest} from '@micro-sentry/core';

export interface State
    extends Partial<
        Pick<SentryRequest, 'tags' | 'extra' | 'user' | 'breadcrumbs' | 'release'>
    > {}
