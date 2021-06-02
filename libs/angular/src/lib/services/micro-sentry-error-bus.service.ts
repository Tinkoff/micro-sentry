import {MonoTypeOperatorFunction, NextObserver, Observable, Subject} from 'rxjs';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {groupBy, mergeMap} from 'rxjs/operators';
import {MICRO_SENTRY_ERRORS_THROTTLE} from '../tokens/errors-throttle';

@Injectable()
export class MicroSentryErrorBusService implements NextObserver<any>, OnDestroy {
    private _errors$ = new Subject<any>();
    errors$: Observable<any>;

    constructor(
        @Inject(MICRO_SENTRY_ERRORS_THROTTLE)
        private throttle: MonoTypeOperatorFunction<any>,
    ) {
        this.errors$ = this._errors$.pipe(
            groupBy(error => error.toString()),
            mergeMap(group => group.pipe(this.throttle)),
        );
    }

    ngOnDestroy(): void {
        this._errors$.complete();
    }

    next(error: any): void {
        this._errors$.next(error);
    }
}
