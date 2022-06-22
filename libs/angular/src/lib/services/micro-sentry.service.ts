import {
  BrowserMicroSentryClient,
  BrowserSentryClientOptions,
} from '@micro-sentry/browser';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { SentryRequestBody } from '@micro-sentry/core';
import { MICRO_SENTRY_CONFIG } from '../tokens/config';
import { WINDOW } from '@ng-web-apis/common';

// @dynamic
@Injectable({ providedIn: 'root' })
export class MicroSentryService
  extends BrowserMicroSentryClient
  implements OnDestroy
{
  constructor(
    @Inject(MICRO_SENTRY_CONFIG) config: BrowserSentryClientOptions,
    @Inject(WINDOW) window: Window
  ) {
    super(config, window);
  }

  protected override getRequestBlank(): SentryRequestBody {
    return {
      ...super.getRequestBlank(),
      sdk: {
        name: 'micro-sentry.javascript.angular',
        version: '0.0.0',
      },
    };
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
