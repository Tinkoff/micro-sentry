import { SentryRequest } from '../models/models';
import { AUTH_HEADER, DSN_REGEXP } from '../consts/consts';
import { computeStackTrace } from '../helpers/compute-stack-trace';
import { SentryClientOptions } from '../models/sentry-client-options';

const __assign =
  Object.assign ||
  function __assign(target: Record<string, any>) {
    const length = arguments.length;

    for (let i = 1; i < length; i++) {
      // eslint-disable-next-line prefer-rest-params
      const source = arguments[i];

      for (const property in source) {
        if (Object.prototype.hasOwnProperty.call(source, property)) {
          target[property] = source[property];
        }
      }
    }

    return target;
  };

export class MicroSentryClient {
  readonly authHeader?: string;
  readonly apiUrl?: string;
  readonly environment?: string;

  constructor(options: SentryClientOptions) {
    if (options.dsn) {
      const searched = DSN_REGEXP.exec(options.dsn);
      const dsn = searched ? searched.slice(1) : [];
      const pathWithProjectId = dsn[5].split('/');
      const path = pathWithProjectId.slice(0, -1).join('/');

      this.apiUrl =
        dsn[0] +
        '://' +
        dsn[3] +
        (dsn[4] ? ':' + dsn[4] : '') +
        (path ? '/' + path : '') +
        '/api/' +
        pathWithProjectId.pop() +
        '/store/';

      this.authHeader =
        'Sentry sentry_version=7,sentry_key=' +
        dsn[1] +
        (dsn[2] ? ',sentry_secret=' + dsn[2] : '');
    }

    this.environment = options.environment;
  }

  prepare(error: Error): SentryRequest {
    return __assign(this.getRequestBlank(), {
      exception: { values: [computeStackTrace(error)] },
    });
  }

  report(error: Error) {
    this.send(this.prepare(error));
  }

  protected send(request: SentryRequest) {
    if (!this.apiUrl) {
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.open('POST', this.apiUrl, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader(AUTH_HEADER, this.authHeader || '');
    xhr.send(JSON.stringify(request));
  }

  protected getRequestBlank(): SentryRequest {
    return {
      platform: 'javascript',
      sdk: {
        name: 'micro-sentry.javascript.browser',
        version: '0.0.0',
      },
      timestamp: Date.now() / 1000,
      request: {
        url: window.location.toString(),
        headers: {
          'User-Agent': window.navigator.userAgent,
        },
      },
      environment: this.environment,
    };
  }
}
