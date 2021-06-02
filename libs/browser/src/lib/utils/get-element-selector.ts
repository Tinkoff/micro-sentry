export function getElementSelector(el: unknown): string {
    const elem = el as {
        getAttribute(key: string): string; // tslint:disable-line:completed-docs
        tagName?: string;
        id?: string;
        className?: string;
    };

    const out = [];

    if (!elem || !elem.tagName) {
        return '';
    }

    out.push(elem.tagName.toLowerCase());

    if (elem.id) {
        out.push(`#${elem.id}`);
    }

    const {className} = elem;

    if (className && typeof className === 'string') {
        const classes = className.split(/\s+/);

        out.concat(classes.map(klass => `.${klass}`));
    }

    ['type', 'name', 'title', 'alt', 'automation-id'].forEach(key => {
        const attr = elem.getAttribute(key);

        if (attr) {
            out.push(`[${key}="${attr}"]`);
        }
    });

    return out.join('');
}
