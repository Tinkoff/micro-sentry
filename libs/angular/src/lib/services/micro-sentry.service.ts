import {
  BrowserMicroSentryClient,
  BrowserSentryClientOptions,
} from '@micro-sentry/browser';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MICRO_SENTRY_CONFIG } from '../tokens/config';

@Injectable()
export class MicroSentryService
  extends BrowserMicroSentryClient
  implements OnDestroy {
  constructor(@Inject(MICRO_SENTRY_CONFIG) config: BrowserSentryClientOptions) {
    super(config);
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
