import { BrowserMicroSentryClient } from '@micro-sentry/browser';
import { Injectable, OnDestroy } from '@angular/core';
import { SentryRequestBody } from '@micro-sentry/core';

// @dynamic
@Injectable({ providedIn: 'root' })
export class MicroSentryService
  extends BrowserMicroSentryClient
  implements OnDestroy
{
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
