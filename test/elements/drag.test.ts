import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { DragElement } from "../../src/elements/drag.js"
import { DragMixin } from "../../src/mixins/drag.js"

let element: DragElement

beforeAll(async () => {
	customElements.define("test-drag", DragElement)

	element = new DragElement()
	element.textContent = "Drag here"

	document.body.appendChild(element)
})

afterAll(() => {
	document.body.removeChild(element)
})

test("DragElement is always draggable", async () => {
	expect(element.draggable).toBe(true)
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

test("DragElement resists changes to draggable state", async () => {
	expect(element.draggable).toBe(true)

	expect(() => {
		element.draggable = false
	}).toThrow()

	expect(element.draggable).toBe(true)

	element.setAttribute("draggable", "false")

	expect(element.draggable).toBe(true)

	element.removeAttribute("draggable")

	expect(element.draggable).toBe(true)
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
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)

	customElement.setAttribute("draggable", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(2)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(2)
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
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)

	customElement.setAttribute("draggable", "false")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(2)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(2)
})
