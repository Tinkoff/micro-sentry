export function fill<T, K extends keyof T>(
  source: T,
  name: K,
  replacement: (original: T[K]) => T[K]
): void {
  const original = source[name];
  const wrapped = replacement(original);

  if (typeof wrapped === 'function') {
    try {
      wrapped.prototype = wrapped.prototype || {};
      Object.defineProperties(wrapped, {
        __original__: {
          enumerable: false,
          value: original,
        },
      });
    } catch (e) {}
  }

  source[name] = wrapped;
}
