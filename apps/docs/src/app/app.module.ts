import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { MicroSentryModule } from '@micro-sentry/angular';

import { AppComponent } from './app.component';
import { IS_BROWSER_PLATFORM, IS_SERVER_PLATFORM } from '@ngx-ssr/platform';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MicroSentryModule.forRoot({
      dsn:
        'https://7cc7ac5332864c97abbccf20d90af60c@o1012545.ingest.sentry.io/5978131',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    errorHandler: ErrorHandler,
    @Inject(IS_SERVER_PLATFORM) isServer: boolean,
    @Inject(IS_BROWSER_PLATFORM) isBrowser: boolean
  ) {
    if (isServer) {
      errorHandler.handleError(new Error('server'));
    }

    if (isBrowser) {
      errorHandler.handleError(new Error('browser'));
    }
  }
}
