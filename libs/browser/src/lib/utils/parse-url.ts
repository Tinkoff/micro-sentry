export function parseUrl(
  url: string
): {
  host?: string;
  path?: string;
  protocol?: string;
  relative?: string;
} {
  if (!url) {
    return {};
  }

  const match = url.match(
    /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
  );

  if (!match) {
    return {};
  }

  // coerce to undefined values to empty string so we don't get 'undefined'
  const query = match[6] || '';
  const fragment = match[8] || '';

  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment, // everything minus origin
  };
}
