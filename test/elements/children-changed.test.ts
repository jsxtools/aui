import { afterAll, beforeAll, expect, test, vi } from "vitest"

import { ChildrenChangedElement } from "../../src/elements/children-changed-element.ts"
import { ChildrenChangedMixin } from "../../src/mixins/children-changed-mixin.ts"

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

		childrenChangedCallback(addedNodes: Node[], removedNodes: Node[]): void {
			super.childrenChangedCallback?.(addedNodes, removedNodes)

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
	await Promise.resolve()

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

test("ChildrenChangedMixin works when upgraded", async () => {
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

	// wait one tick
	await Promise.resolve()

	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.innerHTML = ``

	document.body.appendChild(element)
})

test("ChildrenChangedMixin observes child node changes", async () => {
	const childrenChangedCallbackHandler = vi.fn()

	class TestElement extends ChildrenChangedMixin(HTMLElement) {
		childrenChangedCallback(addedNodes: Node[], removedNodes: Node[]): void {
			childrenChangedCallbackHandler(addedNodes, removedNodes)
		}
	}

	const elementName = `test-children-changed-observer`
	customElements.define(elementName, TestElement)

	const element = new TestElement()
	document.body.appendChild(element)

	// Initial state - no calls yet
	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(0)

	// Add a child node
	const child = document.createElement("div")
	element.appendChild(child)

	// Wait for the mutation observer to trigger
	await Promise.resolve()

	// Should have been called with the added node
	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(childrenChangedCallbackHandler).toHaveBeenCalledWith([child], [])

	// Remove the child node
	element.removeChild(child)

	// Wait for the mutation observer to trigger
	await Promise.resolve()

	// Should have been called with the removed node
	expect(childrenChangedCallbackHandler).toHaveBeenCalledTimes(2)
	expect(childrenChangedCallbackHandler).toHaveBeenCalledWith([], [child])

	// Cleanup
	document.body.removeChild(element)
})
