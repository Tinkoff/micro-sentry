import {Severity} from './severity';
import {Breadcrumb} from './breadcrumb';

export interface SentryFrame {
    colno: number | null;
    lineno: number | null;
    filename: string;
    function: string;
    in_app?: unknown;
}

export interface SentryException {
    type: string;
    value: string;
    stacktrace?: {frames: SentryFrame[]};
}

export type DSN = [string, string, string, string, string, string];

export type Tags = Partial<{[key: string]: string}>;

export type Extras = Partial<{[key: string]: any}>;

export interface User {
    id?: string;
    ip_address?: string;
    email?: string;
    username?: string;
    [key: string]: any;
}

export interface SentryRequest {
    exception?: {values: SentryException[]};
    platform: 'javascript';
    sdk: {
        name: 'micro-sentry.javascript.browser';
        version: string;
    };
    timestamp: number;
    request: {
        url: string;
        headers: {
            'User-Agent': string;
        };
    };
    tags?: Tags;
    extra?: Extras;
    message?: string;
    level?: Severity;
    user?: User;
    breadcrumbs?: Breadcrumb[];
    fingerprint?: string[];
    release?: string;
    environment?: string;
}
