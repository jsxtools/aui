import { afterAll, beforeAll, expect, test } from "vitest"
import { ShadowElement } from "../../src/elements/shadow.js"

let element: ShadowElement
let elementCounter = 0

beforeAll(() => {
	// Define a new element for each test to avoid conflicts
	const elementName = `test-shadow-${++elementCounter}`

	customElements.define(elementName, ShadowElement)

	element = new ShadowElement()

	document.body.appendChild(element)
})

afterAll(() => {
	document.body.removeChild(element)
})

test("ShadowElement has correct default static properties", () => {
	expect(ShadowElement.shadowRootMode).toBe("open")
	expect(ShadowElement.shadowRootDelegatesFocus).toBe(false)
	expect(ShadowElement.shadowRootSerializable).toBe(false)
	expect(ShadowElement.shadowRootSlotAssignment).toBe("named")
	expect(ShadowElement.shadowRootInnerHTML).toBe("<slot>")
	expect(ShadowElement.shadowRootAdoptedStyleSheets).toEqual([])
})

test("ShadowElement creates an instance with proper shadow root", () => {
	expect(element).toBeInstanceOf(HTMLElement)
	expect(element.shadowRoot).toBeInstanceOf(ShadowRoot)
	expect(element.shadowRoot?.mode).toBe("open")
	expect(element.shadowRoot?.delegatesFocus).toBe(false)
	expect(element.shadowRoot?.innerHTML).toBe("<slot></slot>")
})

test("ShadowElement can be configured with custom static properties", () => {
	class CustomShadowElement extends ShadowElement {
		static shadowRootMode = "closed" as const
		static shadowRootDelegatesFocus = true
		static shadowRootInnerHTML = "<div>Custom content</div>"
	}

	const elementName = `test-shadow-custom-${++elementCounter}`
	customElements.define(elementName, CustomShadowElement)
	const customElement = new CustomShadowElement()
	document.body.appendChild(customElement)

	expect(customElement.shadowRoot?.mode).toBe("closed")
	expect(customElement.shadowRoot?.delegatesFocus).toBe(true)
	expect(customElement.shadowRoot?.innerHTML).toBe("<div>Custom content</div>")

	document.body.removeChild(customElement)
})

test("ShadowElement properly initializes all shadow root options", () => {
	class FullyConfiguredShadowElement extends ShadowElement {
		static shadowRootMode = "closed" as const
		static shadowRootDelegatesFocus = true
		static shadowRootSerializable = true
		static shadowRootSlotAssignment = "manual" as const
		static shadowRootInnerHTML = '<div><slot name="test"></slot></div>'
		static shadowRootAdoptedStyleSheets = []
	}

	const elementName = `test-shadow-full-${++elementCounter}`
	customElements.define(elementName, FullyConfiguredShadowElement)
	const configuredElement = new FullyConfiguredShadowElement()
	document.body.appendChild(configuredElement)

	expect(configuredElement.shadowRoot?.mode).toBe("closed")
	expect(configuredElement.shadowRoot?.delegatesFocus).toBe(true)
	expect(configuredElement.shadowRoot?.slotAssignment).toBe("manual")
	expect(configuredElement.shadowRoot?.innerHTML).toBe('<div><slot name="test"></slot></div>')

	document.body.removeChild(configuredElement)
})
