import { MicroSentryErrorBusService } from './micro-sentry-error-bus.service';

describe('MicroSentryErrorBusService', () => {
  let service: MicroSentryErrorBusService;

  beforeEach(() => {
    service = new MicroSentryErrorBusService((source) => source);
  });

  it('There are no new emits after ngOnDestroy', () => {
    const spyFn = jest.fn();

    service.errors$.subscribe(spyFn);
    service.ngOnDestroy();
    service.next(new Error());

    expect(spyFn).not.toHaveBeenCalled();
  });
});
