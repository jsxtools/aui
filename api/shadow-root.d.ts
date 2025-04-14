export declare const setShadowOf: (host: HTMLElement, { adoptedStyleSheets, innerHTML, ...init }: setShadowOf.Init) => ShadowRoot & {
    adoptedStyleSheets: CSSStyleSheet[];
    innerHTML: string;
};
export declare namespace setShadowOf {
    interface Init extends ShadowRootInit {
        adoptedStyleSheets?: CSSStyleSheet[];
        innerHTML?: string;
    }
}
