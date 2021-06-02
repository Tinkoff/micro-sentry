import {getElementSelector} from './get-element-selector';

export function htmlTreeAsString(elem: unknown): string {
    type SimpleNode = {
        parentNode: SimpleNode;
    } | null;

    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        let currentElem = elem as SimpleNode;
        const MAX_TRAVERSE_HEIGHT = 5;
        const MAX_OUTPUT_LEN = 80;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = ' > ';
        const sepLength = separator.length;
        let nextStr;

        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
            nextStr = getElementSelector(currentElem);

            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
            //   (ignore this limit if we are on the first iteration)
            if (
                nextStr === 'html' ||
                (height > 1 &&
                    len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)
            ) {
                break;
            }

            out.push(nextStr);

            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }

        return out.reverse().join(separator);
    } catch (_oO) {
        return '<unknown>';
    }
}
