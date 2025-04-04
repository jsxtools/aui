import { afterAll, beforeAll, expect, test, vi } from "vitest"

import { DragElement } from "../../src/elements/drag-element.ts"
import { DragMixin } from "../../src/mixins/drag-mixin.ts"

let element: DragElement

beforeAll(async () => {
	customElements.define("test-drag", DragElement)

	element = new DragElement()
	element.draggable = true
	element.textContent = "Drag here"

	document.body.appendChild(element)
})

afterAll(() => {
	document.body.removeChild(element)
})

test('DragElement manages "active-drag" state', async () => {
	const dragStartEvent = new DragEvent("dragstart", { bubbles: true })
	const dragEndEvent = new DragEvent("dragend", { bubbles: true })

	expect(element.internals.states.has("active-drag")).toBe(false)

	element.dispatchEvent(dragStartEvent)

	expect(element.internals.states.has("active-drag")).toBe(true)

	element.dispatchEvent(dragEndEvent)

	expect(element.internals.states.has("active-drag")).toBe(false)
})

test("DragElement can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()
	const attributeChangedCallbackHandler = vi.fn()

	class CustomDragElement extends DragElement {
		connectedCallback(): void {
			super.connectedCallback?.()

			connectedCallbackHandler()
		}

		disconnectedCallback(): void {
			super.disconnectedCallback?.()

			disconnectedCallbackHandler()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			super.attributeChangedCallback?.(name, oldValue, newValue)

			attributeChangedCallbackHandler(name, oldValue, newValue)
		}
	}

	const elementName = `test-custom-drag-element`

	customElements.define(elementName, CustomDragElement)

	const customElement = new CustomDragElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("draggable", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)
})

test("DragMixin can be extended", () => {
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

	class CustomDragElement extends DragMixin(SuperElement) {}

	const elementName = `test-custom-drag-from-mixin`

	customElements.define(elementName, CustomDragElement)

	const customElement = new CustomDragElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("draggable", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)
})
