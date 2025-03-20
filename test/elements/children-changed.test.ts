import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { ChildrenChangedElement } from "../../src/elements/children-changed.js"
import { ChildrenChangedMixin } from "../../src/mixins/children-changed.js"

let element: ChildrenChangedElement & ChildrenChangedMixin.Mixin

beforeAll(() => {
	customElements.define("test-children-changed", ChildrenChangedElement)

	element = new ChildrenChangedElement()
	element.textContent = "Parent Element"

	if (!element.isConnected) {
		document.body.appendChild(element)
	}
})

afterAll(() => {
	if (element.isConnected) {
		document.body.removeChild(element)
	}
})

test("ChildrenChangedElement can be extended", async () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()
	const attributeChangedCallbackHandler = vi.fn()
	const childrenChangedCallbackHandler = vi.fn()

	class CustomChildrenChangedElement extends ChildrenChangedElement {
		connectedCallback(): void {
			super.connectedCallback?.()

			connectedCallbackHandler()
		}

		disconnectedCallback(): void {
			super.disconnectedCallback?.()

			disconnectedCallbackHandler()
		}

		childrenChangedCallback(): void {
			super.childrenChangedCallback?.()

			childrenChangedCallbackHandler()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			super.attributeChangedCallback?.(name, oldValue, newValue)

			attributeChangedCallbackHandler(name, oldValue, newValue)
		}
	}

	const elementName = `test-custom-children-changed-element`

	customElements.define(elementName, CustomChildrenChangedElement)

	const customElement = new CustomChildrenChangedElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("data-test", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.textContent = "Changed Content"

	// wait one tick
	await Promise.resolve(true)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)
})

test("ChildrenChangedMixin can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()
	const attributeChangedCallbackHandler = vi.fn()

	// Create a superclass that overrides attributeChangedCallback
	class SuperElement extends HTMLElement {
		connectedCallback(): void {
			connectedCallbackHandler()
		}

		disconnectedCallback(): void {
			disconnectedCallbackHandler()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			attributeChangedCallbackHandler(name, oldValue, newValue)
		}
	}

	class CustomChildrenChangedElement extends ChildrenChangedMixin(SuperElement) {}

	const elementName = `test-custom-children-changed-from-mixin`

	customElements.define(elementName, CustomChildrenChangedElement)

	const customElement = new CustomChildrenChangedElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("data-test", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)
})

test("ChildrenChangedMixin works when upgraded", () => {
	const childrenChangedCallbackHandler = vi.fn()

	// Create a superclass that overrides attributeChangedCallback
	class SuperElement extends HTMLElement {
		childrenChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			childrenChangedCallbackHandler(name, oldValue, newValue)
		}
	}

	class UpgradedCustomChildrenChangedElement extends ChildrenChangedMixin(SuperElement) {}

	const elementName = `test-upgraded-custom-children-changed`

	document.body.innerHTML = `<${elementName}>has content</${elementName}>`

	customElements.define(elementName, UpgradedCustomChildrenChangedElement)

	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.innerHTML = ``

	document.body.appendChild(element)
})
