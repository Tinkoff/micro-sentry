import { computeStackTrace } from './compute-stack-trace';

export const OPERA_25 = {
  message: "Cannot read property 'undef' of null",
  name: 'TypeError',
  stack:
    "TypeError: Cannot read property 'undef' of null\n" +
    '    at http://path/to/file.js:47:22\n' +
    '    at foo (http://path/to/file.js:52:15)\n' +
    '    at bar (http://path/to/file.js:108:168)',
};

export const CHROME_15 = {
  name: 'foo',
  arguments: ['undef'],
  message: "Object #<Object> has no method 'undef'",
  stack:
    "TypeError: Object #<Object> has no method 'undef'\n" +
    '    at bar (http://path/to/file.js:13:17)\n' +
    '    at bar (http://path/to/file.js:16:5)\n' +
    '    at foo (http://path/to/file.js:20:5)\n' +
    '    at http://path/to/file.js:24:4',
};

export const CHROME_36 = {
  message: 'Default error',
  name: 'Error',
  stack:
    'Error: Default error\n' +
    '    at dumpExceptionError (http://localhost:8080/file.js:41:27)\n' +
    '    at HTMLButtonElement.onclick (http://localhost:8080/file.js:107:146)\n' +
    '    at I.e.fn.(anonymous function) [as index] (http://localhost:8080/file.js:10:3651)',
};

// can be generated when Webpack is built with { devtool: eval }
export const CHROME_XX_WEBPACK = {
  message: "Cannot read property 'error' of undefined",
  name: 'TypeError',
  stack:
    "TypeError: Cannot read property 'error' of undefined\n" +
    '   at TESTTESTTEST.eval(webpack:///./src/components/test/test.jsx?:295:108)\n' +
    '   at TESTTESTTEST.render(webpack:///./src/components/test/test.jsx?:272:32)\n' +
    '   at TESTTESTTEST.tryRender(webpack:///./~/react-transform-catch-errors/lib/index.js?:34:31)\n' +
    '   at TESTTESTTEST.proxiedMethod(webpack:///./~/react-proxy/modules/createPrototypeProxy.js?:44:30)',
};

export const FIREFOX_3 = {
  fileName: 'http://127.0.0.1:8000/js/stacktrace.js',
  lineNumber: 44,
  message: 'this.undef is not a function',
  name: 'TypeError',
  stack:
    '()@http://127.0.0.1:8000/js/stacktrace.js:44\n' +
    '(null)@http://127.0.0.1:8000/js/stacktrace.js:31\n' +
    'printStackTrace()@http://127.0.0.1:8000/js/stacktrace.js:18\n' +
    'bar(1)@http://127.0.0.1:8000/js/file.js:13\n' +
    'bar(2)@http://127.0.0.1:8000/js/file.js:16\n' +
    'foo()@http://127.0.0.1:8000/js/file.js:20\n' +
    '@http://127.0.0.1:8000/js/file.js:24\n' +
    '',
};

export const FIREFOX_7 = {
  name: 'foo',
  message: 'bar',
  fileName: 'file:///G:/js/stacktrace.js',
  lineNumber: 44,
  stack:
    '()@file:///G:/js/stacktrace.js:44\n' +
    '(null)@file:///G:/js/stacktrace.js:31\n' +
    'printStackTrace()@file:///G:/js/stacktrace.js:18\n' +
    'bar(1)@file:///G:/js/file.js:13\n' +
    'bar(2)@file:///G:/js/file.js:16\n' +
    'foo()@file:///G:/js/file.js:20\n' +
    '@file:///G:/js/file.js:24\n' +
    '',
};

export const FIREFOX_14 = {
  name: 'foo',
  message: 'x is null',
  stack:
    '@http://path/to/file.js:48\n' +
    'dumpException3@http://path/to/file.js:52\n' +
    'onclick@http://path/to/file.js:1\n' +
    '',
  fileName: 'http://path/to/file.js',
  lineNumber: 48,
};

export const FIREFOX_31 = {
  message: 'Default error',
  name: 'Error',
  stack:
    'foo@http://path/to/file.js:41:13\n' +
    'bar@http://path/to/file.js:1:1\n' +
    '.plugin/e.fn[c]/<@http://path/to/file.js:1:1\n' +
    '',
  fileName: 'http://path/to/file.js',
  lineNumber: 41,
  columnNumber: 12,
};

export const FIREFOX_43_EVAL = {
  name: 'foo',
  columnNumber: 30,
  fileName: 'http://localhost:8080/file.js line 25 > eval line 2 > eval',
  lineNumber: 1,
  message: 'message string',
  stack:
    'baz@http://localhost:8080/file.js line 26 > eval line 2 > eval:1:30\n' +
    'foo@http://localhost:8080/file.js line 26 > eval:2:96\n' +
    '@http://localhost:8080/file.js line 26 > eval:4:18\n' +
    'speak@http://localhost:8080/file.js:26:17\n' +
    '@http://localhost:8080/file.js:33:9',
};

// Internal errors sometimes thrown by Firefox
// More here: https://developer.mozilla.org/en-US/docs/Mozilla/Errors
//
// Note that such errors are instanceof "Exception", not "Error"
export const FIREFOX_44_NS_EXCEPTION = {
  message: '',
  name: 'NS_ERROR_FAILURE',
  stack:
    '[2]</Bar.prototype._baz/</<@http://path/to/file.js:703:28\n' +
    'App.prototype.foo@file:///path/to/file.js:15:2\n' +
    'bar@file:///path/to/file.js:20:3\n' +
    '@file:///path/to/index.html:23:1\n' + // inside <script> tag
    '',
  fileName: 'http://path/to/file.js',
  columnNumber: 0,
  lineNumber: 703,
  result: 2147500037,
};

export const FIREFOX_50_RESOURCE_URL = {
  stack:
    'render@resource://path/data/content/bundle.js:5529:16\n' +
    'dispatchEvent@resource://path/data/content/vendor.bundle.js:18:23028\n' +
    'wrapped@resource://path/data/content/bundle.js:7270:25',
  fileName: 'resource://path/data/content/bundle.js',
  lineNumber: 5529,
  columnNumber: 16,
  message: 'this.props.raw[this.state.dataSource].rows is undefined',
  name: 'TypeError',
};

export const SAFARI_6 = {
  name: 'foo',
  message: "'null' is not an object (evaluating 'x.undef')",
  stack:
    '@http://path/to/file.js:48\n' +
    'dumpException3@http://path/to/file.js:52\n' +
    'onclick@http://path/to/file.js:82\n' +
    '[native code]',
  line: 48,
  sourceURL: 'http://path/to/file.js',
};

export const SAFARI_7 = {
  message: "'null' is not an object (evaluating 'x.undef')",
  name: 'TypeError',
  stack:
    'http://path/to/file.js:48:22\n' +
    'foo@http://path/to/file.js:52:15\n' +
    'bar@http://path/to/file.js:108:107',
  line: 47,
  sourceURL: 'http://path/to/file.js',
};

export const SAFARI_8 = {
  message: "null is not an object (evaluating 'x.undef')",
  name: 'TypeError',
  stack:
    'http://path/to/file.js:47:22\n' +
    'foo@http://path/to/file.js:52:15\n' +
    'bar@http://path/to/file.js:108:23',
  line: 47,
  column: 22,
  sourceURL: 'http://path/to/file.js',
};

export const IE_11 = {
  message: "Unable to get property 'undef' of undefined or null reference",
  name: 'TypeError',
  stack:
    "TypeError: Unable to get property 'undef' of undefined or null reference\n" +
    '   at Anonymous function (http://path/to/file.js:47:21)\n' +
    '   at foo (http://path/to/file.js:45:13)\n' +
    '   at bar (http://path/to/file.js:108:1)',
  description: "Unable to get property 'undef' of undefined or null reference",
  number: -2146823281,
};

export const CHROME_48_BLOB = {
  message: 'Error: test',
  name: 'Error',
  stack:
    'Error: test\n' +
    '    at Error (native)\n' +
    '    at s (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:29146)\n' +
    '    at Object.d [as add] (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:30039)\n' +
    '    at blob:http%3A//localhost%3A8080/d4eefe0f-361a-4682-b217-76587d9f712a:15:10978\n' +
    '    at blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:1:6911\n' +
    '    at n.fire (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:3019)\n' +
    '    at n.handle (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:2863)',
};

describe('Tracekit - Original Tests', () => {
  it('should parse Safari 6 error', () => {
    expect(computeStackTrace(SAFARI_6).stacktrace.frames).toEqual([
      {
        colno: null,
        filename: '[native code]',
        function: '?',
        lineno: null,
      },
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: 'onclick',
        lineno: 82,
      },
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: 'dumpException3',
        lineno: 52,
      },
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 48,
      },
    ]);
  });

  it('should parse Safari 7 error', () => {
    expect(computeStackTrace(SAFARI_7).stacktrace.frames).toEqual([
      {
        colno: 107,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 108,
      },
      {
        colno: 15,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 52,
      },
      {
        colno: 22,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 48,
      },
    ]);
  });

  it('should parse Safari 8 error', () => {
    expect(computeStackTrace(SAFARI_8).stacktrace.frames).toEqual([
      {
        colno: 23,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 108,
      },
      {
        colno: 15,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 52,
      },
      {
        colno: 22,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 47,
      },
    ]);
  });

  it('should parse Firefox 3 error', () => {
    expect(computeStackTrace(FIREFOX_3).stacktrace.frames).toEqual([
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/file.js',
        function: '?',
        lineno: 24,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/file.js',
        function: 'foo',
        lineno: 20,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/file.js',
        function: 'bar',
        lineno: 16,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/file.js',
        function: 'bar',
        lineno: 13,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/stacktrace.js',
        function: 'printStackTrace',
        lineno: 18,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/stacktrace.js',
        function: '?',
        lineno: 31,
      },
      {
        colno: null,
        filename: 'http://127.0.0.1:8000/js/stacktrace.js',
        function: '?',
        lineno: 44,
      },
    ]);
  });

  it('should parse Firefox 7 error', () => {
    expect(computeStackTrace(FIREFOX_7).stacktrace.frames).toEqual([
      {
        colno: null,
        filename: 'file:///G:/js/file.js',
        function: '?',
        lineno: 24,
      },
      {
        colno: null,
        filename: 'file:///G:/js/file.js',
        function: 'foo',
        lineno: 20,
      },
      {
        colno: null,
        filename: 'file:///G:/js/file.js',
        function: 'bar',
        lineno: 16,
      },
      {
        colno: null,
        filename: 'file:///G:/js/file.js',
        function: 'bar',
        lineno: 13,
      },
      {
        colno: null,
        filename: 'file:///G:/js/stacktrace.js',
        function: 'printStackTrace',
        lineno: 18,
      },
      {
        colno: null,
        filename: 'file:///G:/js/stacktrace.js',
        function: '?',
        lineno: 31,
      },
      {
        colno: null,
        filename: 'file:///G:/js/stacktrace.js',
        function: '?',
        lineno: 44,
      },
    ]);
  });

  it('should parse Firefox 14 error', () => {
    expect(computeStackTrace(FIREFOX_14).stacktrace.frames).toEqual([
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: 'onclick',
        lineno: 1,
      },
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: 'dumpException3',
        lineno: 52,
      },
      {
        colno: null,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 48,
      },
    ]);
  });

  it('should parse Firefox 31 error', () => {
    expect(computeStackTrace(FIREFOX_31).stacktrace.frames).toEqual([
      {
        colno: 1,
        filename: 'http://path/to/file.js',
        function: '.plugin/e.fn[c]/<',
        lineno: 1,
      },
      {
        colno: 1,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 1,
      },
      {
        colno: 13,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 41,
      },
    ]);
  });

  it('should parse Firefox 44 ns exceptions', () => {
    expect(
      computeStackTrace(FIREFOX_44_NS_EXCEPTION).stacktrace.frames
    ).toEqual([
      {
        colno: 1,
        filename: 'file:///path/to/index.html',
        function: '?',
        lineno: 23,
      },
      {
        colno: 3,
        filename: 'file:///path/to/file.js',
        function: 'bar',
        lineno: 20,
      },
      {
        colno: 2,
        filename: 'file:///path/to/file.js',
        function: 'App.prototype.foo',
        lineno: 15,
      },
      {
        colno: 28,
        filename: 'http://path/to/file.js',
        function: '[2]</Bar.prototype._baz/</<',
        lineno: 703,
      },
    ]);
  });

  it('should parse Chrome error with no location', () => {
    expect(
      computeStackTrace({
        message: 'foo',
        name: 'bar',
        stack: 'error\n at Array.forEach (native)',
      }).stacktrace.frames
    ).toEqual([
      {
        colno: null,
        filename: 'native',
        function: 'Array.forEach',
        lineno: null,
      },
    ]);
  });

  it('should parse Chrome 15 error', () => {
    expect(computeStackTrace(CHROME_15).stacktrace.frames).toEqual([
      {
        colno: 4,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 24,
      },
      {
        colno: 5,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 20,
      },
      {
        colno: 5,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 16,
      },
      {
        colno: 17,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 13,
      },
    ]);
  });

  it('should parse Chrome 36 error with port numbers', () => {
    expect(computeStackTrace(CHROME_36).stacktrace.frames).toEqual([
      {
        colno: 3651,
        filename: 'http://localhost:8080/file.js',
        function: 'I.e.fn.(anonymous function) [as index]',
        lineno: 10,
      },
      {
        colno: 146,
        filename: 'http://localhost:8080/file.js',
        function: 'HTMLButtonElement.onclick',
        lineno: 107,
      },
      {
        colno: 27,
        filename: 'http://localhost:8080/file.js',
        function: 'dumpExceptionError',
        lineno: 41,
      },
    ]);
  });

  it('should parse Chrome error with webpack URLs', () => {
    expect(computeStackTrace(CHROME_XX_WEBPACK).stacktrace.frames).toEqual([
      {
        colno: 30,
        filename: 'webpack:///./~/react-proxy/modules/createPrototypeProxy.js?',
        function: 'TESTTESTTEST.proxiedMethod',
        lineno: 44,
      },
      {
        colno: 31,
        filename: 'webpack:///./~/react-transform-catch-errors/lib/index.js?',
        function: 'TESTTESTTEST.tryRender',
        lineno: 34,
      },
      {
        colno: 32,
        filename: 'webpack:///./src/components/test/test.jsx?',
        function: 'TESTTESTTEST.render',
        lineno: 272,
      },
      {
        colno: 108,
        filename: 'webpack:///./src/components/test/test.jsx?',
        function: 'TESTTESTTEST.eval',
        lineno: 295,
      },
    ]);
  });

  it('should parse Chrome error with blob URLs', () => {
    expect(computeStackTrace(CHROME_48_BLOB).stacktrace.frames).toEqual([
      {
        colno: 2863,
        filename:
          'blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379',
        function: 'n.handle',
        lineno: 7,
      },
      {
        colno: 3019,
        filename:
          'blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379',
        function: 'n.fire',
        lineno: 7,
      },
      {
        colno: 6911,
        filename:
          'blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379',
        function: '?',
        lineno: 1,
      },
      {
        colno: 10978,
        filename:
          'blob:http%3A//localhost%3A8080/d4eefe0f-361a-4682-b217-76587d9f712a',
        function: '?',
        lineno: 15,
      },
      {
        colno: 30039,
        filename:
          'blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379',
        function: 'Object.d [as add]',
        lineno: 31,
      },
      {
        colno: 29146,
        filename:
          'blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379',
        function: 's',
        lineno: 31,
      },
      {
        colno: null,
        filename: 'native',
        function: 'Error',
        lineno: null,
      },
    ]);
  });

  it('should parse IE 11 error', () => {
    expect(computeStackTrace(IE_11).stacktrace.frames).toEqual([
      {
        colno: 1,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 108,
      },
      {
        colno: 13,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 45,
      },
      {
        colno: 21,
        filename: 'http://path/to/file.js',
        function: 'Anonymous function',
        lineno: 47,
      },
    ]);
  });

  it('should parse Opera 25 error', () => {
    expect(computeStackTrace(OPERA_25).stacktrace.frames).toEqual([
      {
        colno: 168,
        filename: 'http://path/to/file.js',
        function: 'bar',
        lineno: 108,
      },
      {
        colno: 15,
        filename: 'http://path/to/file.js',
        function: 'foo',
        lineno: 52,
      },
      {
        colno: 22,
        filename: 'http://path/to/file.js',
        function: '?',
        lineno: 47,
      },
    ]);
  });

  it('should parse Firefox errors with resource: URLs', () => {
    expect(
      computeStackTrace(FIREFOX_50_RESOURCE_URL).stacktrace.frames
    ).toEqual([
      {
        colno: 25,
        filename: 'resource://path/data/content/bundle.js',
        function: 'wrapped',
        lineno: 7270,
      },
      {
        colno: 23028,
        filename: 'resource://path/data/content/vendor.bundle.js',
        function: 'dispatchEvent',
        lineno: 18,
      },
      {
        colno: 16,
        filename: 'resource://path/data/content/bundle.js',
        function: 'render',
        lineno: 5529,
      },
    ]);
  });

  it('should parse Firefox errors with eval URLs', () => {
    expect(computeStackTrace(FIREFOX_43_EVAL).stacktrace.frames).toEqual([
      {
        colno: 9,
        filename: 'http://localhost:8080/file.js',
        function: '?',
        lineno: 33,
      },
      {
        colno: 17,
        filename: 'http://localhost:8080/file.js',
        function: 'speak',
        lineno: 26,
      },
      {
        colno: 18,
        filename: 'http://localhost:8080/file.js line 26 > eval',
        function: '?',
        lineno: 4,
      },
      {
        colno: 96,
        filename: 'http://localhost:8080/file.js line 26 > eval',
        function: 'foo',
        lineno: 2,
      },
      {
        colno: 30,
        filename: 'http://localhost:8080/file.js line 26 > eval line 2 > eval',
        function: 'baz',
        lineno: 1,
      },
    ]);
  });
});

describe('Tracekit - Custom Tests', () => {
  it('should parse errors with custom schemes', () => {
    const CHROMIUM_EMBEDDED_FRAMEWORK_CUSTOM_SCHEME = {
      message: 'message string',
      name: 'Error',
      stack: `Error: message string
            at examplescheme://examplehost/cd351f7250857e22ceaa.worker.js:70179:15`,
    };

    expect(
      computeStackTrace(CHROMIUM_EMBEDDED_FRAMEWORK_CUSTOM_SCHEME).stacktrace
        .frames
    ).toEqual([
      {
        colno: 15,
        filename: 'examplescheme://examplehost/cd351f7250857e22ceaa.worker.js',
        function: '?',
        lineno: 70179,
      },
    ]);
  });

  describe('should parse exceptions with native code frames', () => {
    it('in Chrome 73', () => {
      const CHROME73_NATIVE_CODE_EXCEPTION = {
        message: 'test',
        name: 'Error',
        stack: `Error: test
            at fooIterator (http://localhost:5000/test:20:17)
            at Array.map (<anonymous>)
            at foo (http://localhost:5000/test:19:19)
            at http://localhost:5000/test:24:7`,
      };

      expect(
        computeStackTrace(CHROME73_NATIVE_CODE_EXCEPTION).stacktrace.frames
      ).toEqual([
        {
          colno: 7,
          filename: 'http://localhost:5000/test',
          function: '?',
          lineno: 24,
        },
        {
          colno: 19,
          filename: 'http://localhost:5000/test',
          function: 'foo',
          lineno: 19,
        },
        {
          colno: null,
          filename: '<anonymous>',
          function: 'Array.map',
          lineno: null,
        },
        {
          colno: 17,
          filename: 'http://localhost:5000/test',
          function: 'fooIterator',
          lineno: 20,
        },
      ]);
    });

    it('in Firefox 66', () => {
      const FIREFOX66_NATIVE_CODE_EXCEPTION = {
        message: 'test',
        name: 'Error',
        stack: `fooIterator@http://localhost:5000/test:20:17
            foo@http://localhost:5000/test:19:19
            @http://localhost:5000/test:24:7`,
      };

      expect(
        computeStackTrace(FIREFOX66_NATIVE_CODE_EXCEPTION).stacktrace.frames
      ).toEqual([
        {
          colno: 7,
          filename: 'http://localhost:5000/test',
          function: '?',
          lineno: 24,
        },
        {
          colno: 19,
          filename: 'http://localhost:5000/test',
          function: 'foo',
          lineno: 19,
        },
        {
          colno: 17,
          filename: 'http://localhost:5000/test',
          function: 'fooIterator',
          lineno: 20,
        },
      ]);
    });

    it('in Safari 12', () => {
      const SAFARI12_NATIVE_CODE_EXCEPTION = {
        message: 'test',
        name: 'Error',
        stack: `fooIterator@http://localhost:5000/test:20:26
            map@[native code]
            foo@http://localhost:5000/test:19:22
            global code@http://localhost:5000/test:24:10`,
      };

      expect(
        computeStackTrace(SAFARI12_NATIVE_CODE_EXCEPTION).stacktrace.frames
      ).toEqual([
        {
          colno: 10,
          filename: 'http://localhost:5000/test',
          function: 'global code',
          lineno: 24,
        },
        {
          colno: 22,
          filename: 'http://localhost:5000/test',
          function: 'foo',
          lineno: 19,
        },
        {
          colno: null,
          filename: '[native code]',
          function: 'map',
          lineno: null,
        },
        {
          colno: 26,
          filename: 'http://localhost:5000/test',
          function: 'fooIterator',
          lineno: 20,
        },
      ]);
    });

    it('in Edge 44', () => {
      const EDGE44_NATIVE_CODE_EXCEPTION = {
        message: 'test',
        name: 'Error',
        stack: `Error: test
            at fooIterator (http://localhost:5000/test:20:11)
            at Array.prototype.map (native code)
            at foo (http://localhost:5000/test:19:9)
            at Global code (http://localhost:5000/test:24:7)`,
      };

      expect(
        computeStackTrace(EDGE44_NATIVE_CODE_EXCEPTION).stacktrace.frames
      ).toEqual([
        {
          colno: 7,
          filename: 'http://localhost:5000/test',
          function: 'Global code',
          lineno: 24,
        },
        {
          colno: 9,
          filename: 'http://localhost:5000/test',
          function: 'foo',
          lineno: 19,
        },
        {
          colno: null,
          filename: 'native code',
          function: 'Array.prototype.map',
          lineno: null,
        },
        {
          colno: 11,
          filename: 'http://localhost:5000/test',
          function: 'fooIterator',
          lineno: 20,
        },
      ]);
    });
  });
});
