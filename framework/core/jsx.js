export function jsx(type, props, ...children) {
    return { type, props: props || {}, children };
}