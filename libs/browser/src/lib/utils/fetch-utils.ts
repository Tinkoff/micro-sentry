export function getFetchMethod(fetchArgs: any[] = []): string {
  if (
    'Request' in window &&
    fetchArgs[0] instanceof Request &&
    fetchArgs[0].method
  ) {
    return String(fetchArgs[0].method).toUpperCase();
  }

  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase();
  }

  return 'GET';
}

export function getFetchUrl(fetchArgs: any[] = []): string {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0];
  }

  if ('Request' in window && fetchArgs[0] instanceof Request) {
    return fetchArgs[0].url;
  }

  return String(fetchArgs[0]);
}

export function supportsFetch(): boolean {
  if (!('fetch' in window)) {
    return false;
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new Headers();
    // tslint:disable-next-line:no-unused-expression
    new Request('');
    // tslint:disable-next-line:no-unused-expression
    new Response();

    return true;
  } catch (e) {
    return false;
  }
}

export function isNativeFetch(func: Function): boolean {
  return (
    func &&
    /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString())
  );
}

export function supportsNativeFetch(): boolean {
  if (!supportsFetch()) {
    return false;
  }

  // Fast path to avoid DOM I/O
  // tslint:disable-next-line:no-unbound-method
  if (isNativeFetch(window.fetch)) {
    return true;
  }

  // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
  // so create a "pure" iframe to see if that has native fetch
  let result = false;
  const doc = window.document;

  // tslint:disable-next-line:no-unbound-method deprecation
  if (doc && typeof (doc.createElement as unknown) === `function`) {
    try {
      const sandbox = doc.createElement('iframe');

      sandbox.sandbox.add('allow-scripts');
      sandbox.sandbox.add('allow-same-origin');

      sandbox.hidden = true;
      doc.head.appendChild(sandbox);

      if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
        // tslint:disable-next-line:no-unbound-method
        result = isNativeFetch(sandbox.contentWindow.fetch);
      }

      doc.head.removeChild(sandbox);
    } catch (err) {
      // 'Could not create sandbox iframe for pure fetch check, bailing to window.fetch'
    }
  }

  return result;
}
