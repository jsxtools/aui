export const customElements: CustomElementRegistry = globalThis.customElements || { define() {} }

export const HTMLElement: CustomElementConstructor = globalThis.HTMLElement || class {}

export interface CustomElement extends HTMLElement {
	attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void
	connectedCallback?(): void
	disconnectedCallback?(): void
}

export interface CustomElementConstructor<T = CustomElement> {
	new (...args: any[]): globalThis.HTMLElement & T

	observedAttributes?: string[]
	formAssociated?: boolean
}
