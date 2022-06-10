import { ErrorHandler, Injectable } from '@angular/core';
import { MicroSentryErrorBusService } from './micro-sentry-error-bus.service';
import { MicroSentryService } from './micro-sentry.service';

@Injectable({ providedIn: 'root' })
export class MicroSentryErrorHandler implements ErrorHandler {
  constructor(
    private errorBus: MicroSentryErrorBusService,
    microSentry: MicroSentryService
  ) {
    // tslint:disable-next-line:rxjs-prefer-angular-takeuntil
    errorBus.errors$.subscribe((error) => {
      microSentry.report(error);
    });
  }

  handleError(error: any): void {
    this.errorBus.next(error);

    console.error(error);
  }
}
