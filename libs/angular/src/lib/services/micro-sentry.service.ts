import {
  BrowserMicroSentryClient,
  BrowserSentryClientOptions,
} from '@micro-sentry/browser';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MICRO_SENTRY_CONFIG } from '../tokens/config';
import { WINDOW } from '@ng-web-apis/common';

// @dynamic
@Injectable()
export class MicroSentryService
  extends BrowserMicroSentryClient
  implements OnDestroy {
  constructor(
    @Inject(MICRO_SENTRY_CONFIG) config: BrowserSentryClientOptions,
    @Inject(WINDOW) window: Window
  ) {
    super(config, window);
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
