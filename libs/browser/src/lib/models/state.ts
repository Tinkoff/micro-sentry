import { SentryRequestBody } from '@micro-sentry/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface State
  extends Partial<
    Pick<
      SentryRequestBody,
      'tags' | 'extra' | 'user' | 'breadcrumbs' | 'release'
    >
  > {}
