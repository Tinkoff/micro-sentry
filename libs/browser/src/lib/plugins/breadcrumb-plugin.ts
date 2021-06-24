import { MicroSentryPlugin } from '../models/plugin';
import { BrowserMicroSentryClient } from '../services/browser-micro-sentry-client';
import { fill } from '../utils/fill';
import { Severity } from '@micro-sentry/core';
import { parseUrl } from '../utils/parse-url';
import {
  getFetchMethod,
  getFetchUrl,
  supportsNativeFetch,
} from '../utils/fetch-utils';
import { htmlTreeAsString } from '../utils/html-tree-as-path';
import { safeJoin } from '../utils/safe-join';

export class BreadcrumbPlugin implements MicroSentryPlugin {
  private subscriptions: (() => void)[] = [];
  private lastHref?: string;

  constructor(readonly client: BrowserMicroSentryClient) {
    this.initDOM();
    this.initConsole();
    this.initFetch();
    this.initHistory();
    this.initXHR();
  }

  initXHR(): void {
    if (!('XMLHttpRequest' in window)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const xhrproto = XMLHttpRequest.prototype;

    fill(xhrproto, 'open', (originalOpen) => {
      return function (...args: any[]): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const xhr = this; // tslint:disable-line:no-this-assignment
        const url = args[1];

        xhr.__sentry_xhr__ = {
          method: typeof args[0] === 'string' ? args[0].toUpperCase() : args[0],
          url: args[1],
        };

        // if Sentry key appears in URL, don't capture it as a request
        if (
          typeof url === 'string' &&
          xhr.__sentry_xhr__.method === 'POST' &&
          url.match(/sentry_key/)
        ) {
          xhr.__sentry_own_request__ = true;
        }

        const onreadystatechangeHandler = () => {
          if (xhr.readyState === 4) {
            try {
              // touching statusCode in some platforms throws
              // an exception
              if (xhr.__sentry_xhr__) {
                xhr.__sentry_xhr__.status_code = xhr.status;
              }
            } catch (e) {
              /* do nothing */
            }
            self.xhrBreadcrumb({
              args,
              endTimestamp: Date.now(),
              startTimestamp: Date.now(),
              xhr,
            });
          }
        };

        if (
          'onreadystatechange' in xhr &&
          typeof xhr.onreadystatechange === 'function'
        ) {
          fill(xhr, 'onreadystatechange', (original) => {
            return function onreadystatechange(...readyStateArgs: any[]) {
              onreadystatechangeHandler();
              original.apply(xhr, readyStateArgs);
            };
          });
        } else {
          xhr.addEventListener('readystatechange', onreadystatechangeHandler);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return originalOpen.apply(xhr, args);
      };
    });

    fill(xhrproto, 'send', (originalSend) => {
      return function send(...args: any[]): void {
        self.xhrBreadcrumb({
          args,
          startTimestamp: Date.now(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          xhr: this,
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return originalSend.apply(this, args);
      };
    });
  }

  initHistory(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const oldOnPopState = window.onpopstate;

    window.onpopstate = function (
      this: WindowEventHandlers,
      ...args: any[]
    ): any {
      const to = window.location.href;
      // keep track of the current URL state, as we always receive only the updated state
      const from = self.lastHref;

      self.lastHref = to;
      self.historyBreadcrumb({
        from,
        to,
      });

      if (oldOnPopState) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return oldOnPopState.apply(this, args);
      }
    };

    /** @hidden */
    function historyReplacementFunction(originalHistoryFunction: any): any {
      return function (this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined;

        if (url) {
          // coerce to string (this is what pushState does)
          const from = self.lastHref;
          const to = String(url);

          // keep track of the current URL state, as we always receive only the updated state
          self.lastHref = to;
          self.historyBreadcrumb({
            from,
            to,
          });
        }

        return originalHistoryFunction.apply(this, args);
      };
    }

    fill(window.history, 'pushState', historyReplacementFunction);
    fill(window.history, 'replaceState', historyReplacementFunction);
  }

  destroy() {
    this.subscriptions.forEach((fn) => fn());
  }

  private initDOM() {
    const clickEventHandler = (event: Event) =>
      this.prepareDomEvent('click', event);
    const keypressEventHandler = (event: Event) =>
      this.prepareDomEvent('keypress', event);

    window.document.addEventListener('click', clickEventHandler, false);
    window.document.addEventListener('keypress', keypressEventHandler, false);

    this.subscriptions.push(() => {
      window.document.removeEventListener('click', clickEventHandler, false);
      window.document.removeEventListener(
        'keypress',
        keypressEventHandler,
        false
      );
    });
  }

  private prepareDomEvent(name: string, event: Event) {
    let target;

    // Accessing event.target can throw (see getsentry/raven-js#838, #768)
    try {
      target = event.target
        ? htmlTreeAsString(event.target as Node)
        : htmlTreeAsString((event as unknown) as Node);
    } catch (e) {
      target = '<unknown>';
    }

    if (target.length === 0) {
      return;
    }

    this.client.addBreadcrumb({
      category: `ui.${name}`,
      message: target,
    });
  }

  private initFetch(): void {
    if (!supportsNativeFetch()) {
      return;
    }

    fill(window, 'fetch', (originalFetch) => {
      return (...args: [any]) => {
        const commonHandlerData = {
          args,
          fetchData: {
            method: getFetchMethod(args),
            url: getFetchUrl(args),
          },
          startTimestamp: Date.now(),
        };

        this.fetchBreadcrumb({
          ...commonHandlerData,
        });

        return originalFetch.apply(window, args).then(
          (response: Response) => {
            this.fetchBreadcrumb({
              ...commonHandlerData,
              endTimestamp: Date.now(),
              response,
            });

            return response;
          },
          (error: Error) => {
            this.fetchBreadcrumb({
              ...commonHandlerData,
              endTimestamp: Date.now(),
              error,
            });

            throw error;
          }
        );
      };
    });
  }

  private fetchBreadcrumb(handlerData: { [key: string]: any }): void {
    // We only capture complete fetch requests
    if (!handlerData.endTimestamp) {
      return;
    }

    if (
      handlerData.fetchData.url.match(/sentry_key/) &&
      handlerData.fetchData.method === 'POST'
    ) {
      // We will not create breadcrumbs for fetch requests that contain `sentry_key` (internal sentry requests)
      return;
    }

    if (handlerData.error) {
      this.client.addBreadcrumb({
        category: 'fetch',
        data: handlerData.fetchData,
        level: Severity.error,
        type: 'http',
      });
    } else {
      this.client.addBreadcrumb({
        category: 'fetch',
        data: {
          ...handlerData.fetchData,
          status_code: handlerData.response.status,
        },
        type: 'http',
      });
    }
  }

  private xhrBreadcrumb(handlerData: { [key: string]: any }): void {
    if (handlerData.endTimestamp) {
      // We only capture complete, non-sentry requests
      if (handlerData.xhr.__sentry_own_request__) {
        return;
      }

      this.client.addBreadcrumb({
        category: 'xhr',
        data: handlerData.xhr.__sentry_xhr__,
        type: 'http',
      });

      return;
    }
  }

  private initConsole() {
    ([
      'debug',
      'info',
      'warn',
      'error',
      'log',
      'assert',
    ] as (keyof Console)[]).forEach((level) => {
      if (!(level in window.console)) {
        return;
      }

      fill(window.console, level, (originalConsoleLevel: () => any) => {
        return (...args: any[]) => {
          // {args, level};

          const breadcrumb = {
            category: 'console',
            data: {
              arguments: args.map((arg) => {
                // если аргументы сериализуются с ошибкой
                // приводим значение к строке и возвращаем его
                try {
                  JSON.stringify(arg);

                  return arg;
                } catch (e) {
                  return Object.prototype.toString.call(arg);
                }
              }),
              logger: 'console',
            },
            level: level as Severity,
            message: safeJoin(args, ' '),
          };

          if (level === 'assert') {
            if (args[0] === false) {
              breadcrumb.message = `Assertion failed: ${
                safeJoin(args.slice(1), ' ') || 'console.assert'
              }`;
              breadcrumb.data.arguments = args.slice(1);
            } else {
              // Don't capture a breadcrumb for passed assertions
              return;
            }
          }

          this.client.addBreadcrumb(breadcrumb);

          // this fails for some browsers. :(
          if (originalConsoleLevel) {
            Function.prototype.apply.call(
              originalConsoleLevel,
              window.console,
              args
            );
          }
        };
      });
    });
  }

  private historyBreadcrumb(handlerData: { [key: string]: any }): void {
    let from = handlerData.from;
    let to = handlerData.to;
    const parsedLoc = parseUrl(window.location.href);
    let parsedFrom = parseUrl(from);
    const parsedTo = parseUrl(to);

    // Initial pushState doesn't provide `from` information
    if (!parsedFrom.path) {
      parsedFrom = parsedLoc;
    }

    // Use only the path component of the URL if the URL matches the current
    // document (almost all the time when using pushState)
    if (
      parsedLoc.protocol === parsedTo.protocol &&
      parsedLoc.host === parsedTo.host
    ) {
      // tslint:disable-next-line:no-parameter-reassignment
      to = parsedTo.relative;
    }

    if (
      parsedLoc.protocol === parsedFrom.protocol &&
      parsedLoc.host === parsedFrom.host
    ) {
      // tslint:disable-next-line:no-parameter-reassignment
      from = parsedFrom.relative;
    }

    this.client.addBreadcrumb({
      category: 'navigation',
      data: {
        from,
        to,
      },
    });
  }
}
