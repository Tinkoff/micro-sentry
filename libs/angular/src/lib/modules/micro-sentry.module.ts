import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSentryClientOptions } from '@micro-sentry/browser';
import { MICRO_SENTRY_CONFIG } from '../tokens/config';
import { MicroSentryErrorHandler } from '../services/error-handler.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class MicroSentryModule {
  public static forRoot(
    config: BrowserSentryClientOptions
  ): ModuleWithProviders<MicroSentryModule> {
    return {
      ngModule: MicroSentryModule,
      providers: [
        {
          provide: ErrorHandler,
          useExisting: MicroSentryErrorHandler,
        },
        {
          provide: MICRO_SENTRY_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
