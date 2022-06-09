import {
  Breadcrumb,
  SentryClientOptions,
  SentryRequestBody,
} from '@micro-sentry/core';
import { MicroSentryPluginConstructor } from './plugin';

export interface BrowserSentryClientOptions extends SentryClientOptions {
  plugins?: MicroSentryPluginConstructor[];
  beforeSend?(request: SentryRequestBody): SentryRequestBody;
  beforeBreadcrumb?(breadcrumb: Breadcrumb): Breadcrumb;
  ignoreErrors?: Array<string | RegExp>;
  blacklistUrls?: Array<string | RegExp>;
  release?: string;
}
