export function isMatchingPattern(value: string, pattern: RegExp | string): boolean {
    if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
        return (pattern as RegExp).test(value);
    }

    if (typeof pattern === 'string') {
        return value.indexOf(pattern) !== -1;
    }

    return false;
}
