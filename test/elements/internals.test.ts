import { expect, test } from "vitest"

import { InternalsElement } from "../../src/elements/internals-element.ts"
import { InternalsMixin } from "../../src/mixins/internals-mixin.ts"

// Register the custom element
customElements.define("test-internals", InternalsElement)

test("InternalsElement provides ElementInternals API", () => {
	// Create a new instance
	const element = new InternalsElement()

	document.body.appendChild(element)

	// Test that internals property exists and is an ElementInternals instance
	expect(element.internals).toBeDefined()
	expect(element.internals).toBeInstanceOf(ElementInternals)

	// Test attachInternals method returns the same internals object
	const attachedInternals = element.attachInternals()

	expect(attachedInternals).toBe(element.internals)

	// Cleanup
	document.body.removeChild(element)
})

test("InternalsMixin handles different base element scenarios", () => {
	// Test with a base element that already has attachInternals
	class BaseWithInternals extends HTMLElement {
		attachInternals() {
			return super.attachInternals()
		}
	}
	class TestWithInternals extends InternalsMixin(BaseWithInternals) {}
	customElements.define("test-with-internals", TestWithInternals)

	// Test with a base element that doesn't override attachInternals
	class BaseElement extends HTMLElement {}
	class TestBasic extends InternalsMixin(BaseElement) {}
	customElements.define("test-basic-internals", TestBasic)

	// Create and test both variants
	const elementWithInternals = new TestWithInternals()
	const basicElement = new TestBasic()

	document.body.appendChild(elementWithInternals)
	document.body.appendChild(basicElement)

	// Both should have working internals
	expect(elementWithInternals.internals).toBeInstanceOf(ElementInternals)
	expect(basicElement.internals).toBeInstanceOf(ElementInternals)

	// Both should return the same internals object when attachInternals is called
	expect(elementWithInternals.attachInternals()).toBe(elementWithInternals.internals)
	expect(basicElement.attachInternals()).toBe(basicElement.internals)

	// Cleanup
	document.body.removeChild(elementWithInternals)
	document.body.removeChild(basicElement)
})

test("InternalsMixin prevents multiple attachInternals calls", () => {
	const element = new InternalsElement()
	document.body.appendChild(element)

	// First call to attachInternals should work and return the existing internals
	expect(element.attachInternals()).toBe(element.internals)

	// Second call to attachInternals should throw
	expect(() => {
		element.internals = element.attachInternals()
	}).not.toThrow()

	document.body.removeChild(element)
})
