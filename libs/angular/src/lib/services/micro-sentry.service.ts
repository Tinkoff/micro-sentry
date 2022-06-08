import {
  BrowserMicroSentryClient,
  BrowserSentryClientOptions,
} from '@micro-sentry/browser';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { MICRO_SENTRY_CONFIG } from '../tokens/config';
import { WINDOW } from '@ng-web-apis/common';
import { SentryRequestBody, AUTH_HEADER } from '@micro-sentry/core';

// @dynamic
@Injectable()
export class MicroSentryService
  extends BrowserMicroSentryClient
  implements OnDestroy {
  private http: HttpClient;

  constructor(
    @Inject(MICRO_SENTRY_CONFIG) config: BrowserSentryClientOptions,
    @Inject(WINDOW) window: Window,
    httpBackend: HttpBackend
  ) {
    super(config, window);

    this.http = new HttpClient(httpBackend);
  }

  createRequest(body: SentryRequestBody) {
    this.http
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .post(this.apiUrl!, body, {
        headers: { [AUTH_HEADER]: this.authHeader || '' },
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
