export declare const customElements: CustomElementRegistry;
export declare const HTMLElement: CustomElementConstructor;
/** Base class for custom elements. */
export declare class CustomElement extends globalThis.HTMLElement {
    /** List of attributes to observe for changes, invoking `attributeChangedCallback`. */
    static observedAttributes?: string[];
    /** Indicates whether the custom element participates in form submission. */
    static formAssociated?: boolean;
    /** Called when one of the element's observed attributes changes. */
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
    /** Called when the element is added to a document. */
    connectedCallback?(): void;
    /** Called when the element is removed from a document. */
    disconnectedCallback?(): void;
}
/** Constructor interface for custom elements. */
export interface CustomElementConstructor<T = CustomElement> {
    /** Creates a new instance of the custom element. */
    new (...args: any[]): globalThis.HTMLElement & T;
    /** List of attributes to observe for changes, invoking `attributeChangedCallback`. */
    observedAttributes?: string[];
    /** Indicates whether the custom element participates in form submission. */
    formAssociated?: boolean;
}
