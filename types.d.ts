/** Base class for custom elements. */
export declare class CustomElement extends HTMLElement {
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
    /** Called when the element is associated or disassociated with a form. */
    formAssociatedCallback?(form: HTMLFormElement | null): void;
    /** Called when the disabled state of the element changes. */
    formDisabledCallback?(isDisabled: boolean): void;
    /** Called when the associated form is reset. */
    formResetCallback?(): void;
    /** Called when the browser automatically fills out the element. */
    formStateRestoreCallback?(state: string | File | FormData, reason: "autocomplete" | "restore"): void;
}
/** Constructor interface for custom elements. */
export interface CustomElementConstructor<T = CustomElement> {
    /** Creates a new instance of the custom element. */
    new (...args: any[]): HTMLElement & T;
    /** List of attributes to observe for changes, invoking `attributeChangedCallback`. */
    observedAttributes?: string[];
    /** Indicates whether the custom element participates in form submission. */
    formAssociated?: boolean;
}
/** Provides methods for registering custom elements and querying registered elements. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) */
export declare class CustomElementRegistry {
    /** List of attributes to observe for changes, invoking `attributeChangedCallback`. */
    static observedAttributes?: string[];
    /** Indicates whether the custom element participates in form submission. */
    static formAssociated?: boolean;
    /** Adds a definition for a custom element to the custom element registry. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) */
    define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void;
    /** Returns the constructor for a previously-defined custom element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/get) */
    get(name: string): CustomElementConstructor | undefined;
    /** Returns the name for a previously-defined custom element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/getName) */
    getName(constructor: CustomElementConstructor): string | null;
    /** Upgrades all shadow-containing custom elements in the given root. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/upgrade) */
    upgrade(root: Node): void;
    /** Returns a Promise that resolves when the named element is defined. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/whenDefined) */
    whenDefined(name: string): Promise<CustomElementConstructor>;
}
