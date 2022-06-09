import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { MicroSentryModule } from '@micro-sentry/angular';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IS_BROWSER_PLATFORM, IS_SERVER_PLATFORM } from '@ngx-ssr/platform';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    MicroSentryModule.forRoot({
      dsn:
        'https://099f64b67a9d4f61985dc20cfc57ca99@o275325.ingest.sentry.io/6484556',
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
