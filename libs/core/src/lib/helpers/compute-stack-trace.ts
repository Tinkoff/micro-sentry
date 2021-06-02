// @for-internal-use

import { SentryException, SentryFrame } from '../models/models';
import {
  CHROME_REGEXP,
  GECKO_REGEXP,
  UNKNOWN_FUNCTION,
  WINJS_REGEXP,
} from '../consts/consts';

function computeStackTraceFromStackProp(ex: Error): SentryException | null {
  if (!ex.stack) {
    return null;
  }

  const stack = [];
  const lines = ex.stack.split('\n');
  let parts;
  let element: SentryFrame;

  for (let i = 0; i < lines.length; ++i) {
    // tslint:disable-next-line:no-conditional-assignment
    if ((parts = CHROME_REGEXP.exec(lines[i]))) {
      element = {
        // working with the regexp above is super painful. it is quite a hack, but just stripping the `address at `
        // prefix here seems like the quickest solution for now.
        filename:
          parts[2] && parts[2].indexOf('address at ') === 0
            ? parts[2].substr('address at '.length)
            : parts[2],
        function: parts[1] || UNKNOWN_FUNCTION,
        lineno: parts[3] ? +parts[3] : null,
        colno: parts[4] ? +parts[4] : null,
      };
      // tslint:disable-next-line:no-conditional-assignment
    } else if ((parts = WINJS_REGEXP.exec(lines[i]))) {
      element = {
        filename: parts[2],
        function: parts[1] || UNKNOWN_FUNCTION,
        lineno: +parts[3],
        colno: parts[4] ? +parts[4] : null,
      };
      // tslint:disable-next-line:no-conditional-assignment
    } else if ((parts = GECKO_REGEXP.exec(lines[i]))) {
      if (i === 0 && !parts[5] && (ex as any).columnNumber !== void 0) {
        // FireFox uses this awesome columnNumber property for its top frame
        // Also note, Firefox's column number is 0-based and everything else expects 1-based,
        // so adding 1
        // NOTE: this hack doesn't work if top-most frame is eval
        // TODO: why do not we include column into an interface?
        (stack[0] as any).column = ((ex as any).columnNumber as number) + 1;
      }

      element = {
        filename: parts[3],
        function: parts[1] || UNKNOWN_FUNCTION,
        lineno: parts[4] ? +parts[4] : null,
        colno: parts[5] ? +parts[5] : null,
      };
    } else {
      continue;
    }

    if (!element.function && element.lineno) {
      element.function = UNKNOWN_FUNCTION;
    }

    stack.push(element);
  }

  if (!stack.length) {
    return null;
  }

  return {
    value: extractMessage(ex),
    type: ex.name,
    stacktrace: { frames: stack.reverse() },
  };
}

function extractMessage(ex: Error): string {
  const message = (ex && ex.message) || 'No error message';

  return message.split('\n').filter((s) => !!s)[0];
}

export function computeStackTrace(ex: Error): SentryException {
  // tslint:disable:no-unsafe-any

  try {
    const stack = computeStackTraceFromStackProp(ex);

    if (stack) {
      return stack;
    }
  } catch (e) {}

  return {
    value: extractMessage(ex),
    type: ex && ex.name,
    stacktrace: { frames: [] },
  };
}
