import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { FormAssociatedElement } from "../../src/elements/form-associated.ts"
import { FormAssociatedMixin } from "../../src/mixins/form-associated.ts"

let form: HTMLFormElement
let element: FormAssociatedElement

beforeAll(() => {
	customElements.define("test-form-associated", FormAssociatedElement)

	form = document.createElement("form")

	element = new FormAssociatedElement()
	element.name = "test-input"

	form.appendChild(element)

	document.body.appendChild(form)
})

afterAll(() => {
	document.body.removeChild(form)
})

test("FormAssociatedElement is form-associated", () => {
	expect(FormAssociatedElement.formAssociated).toBe(true)
	expect(element.form).toBe(form)
})

test("FormAssociatedElement handles disabled state", () => {
	expect(element.disabled).toBe(false)

	element.disabled = true

	expect(element.disabled).toBe(true)
	expect(element.internals.ariaDisabled).toBe("true")

	element.disabled = false
	expect(element.disabled).toBe(false)
	expect(element.internals.ariaDisabled).toBe("false")

	// Test attribute reflection
	element.setAttribute("disabled", "")
	expect(element.disabled).toBe(true)
	expect(element.internals.ariaDisabled).toBe("true")

	element.removeAttribute("disabled")
	expect(element.disabled).toBe(false)
	expect(element.internals.ariaDisabled).toBe("false")
})

test("FormAssociatedElement handles required state", () => {
	expect(element.required).toBe(false)

	element.required = true
	expect(element.required).toBe(true)
	expect(element.internals.ariaRequired).toBe("true")

	element.required = false
	expect(element.required).toBe(false)
	expect(element.internals.ariaRequired).toBe("false")

	// Test attribute reflection
	element.setAttribute("required", "")
	expect(element.required).toBe(true)
	expect(element.internals.ariaRequired).toBe("true")

	element.removeAttribute("required")
	expect(element.required).toBe(false)
	expect(element.internals.ariaRequired).toBe("false")
})

test("FormAssociatedElement handles name attribute", () => {
	expect(element.name).toBe("test-input")

	element.name = "new-name"

	expect(element.name).toBe("new-name")
	expect(element.getAttribute("name")).toBe("new-name")

	element.setAttribute("name", "another-name")

	expect(element.getAttribute("name")).toBe("another-name")
	expect(element.name).toBe("another-name")
})

test("FormAssociatedElement handles validation", () => {
	expect(element.willValidate).toBe(true)
	expect(element.validity.valid).toBe(true)
	expect(element.validationMessage).toBe("")

	element.setCustomValidity("Custom error message")
	expect(element.validity.valid).toBe(false)
	expect(element.validity.customError).toBe(true)
	expect(element.validationMessage).toBe("Custom error message")

	element.setCustomValidity("")
	expect(element.validity.valid).toBe(true)
	expect(element.validity.customError).toBe(false)
	expect(element.validationMessage).toBe("")
})

test("FormAssociatedElement supports validation methods", () => {
	const reportValiditySpy = vi.spyOn(element.internals, "reportValidity")

	element.setCustomValidity("Error")
	expect(element.checkValidity()).toBe(false)

	element.reportValidity()
	expect(reportValiditySpy).toHaveBeenCalled()

	element.setCustomValidity("")
	expect(element.checkValidity()).toBe(true)
})

test("FormAssociatedElement handles defaultValue", () => {
	// Test initial state
	expect(element.defaultValue).toBe("")

	// Test setting via attribute
	element.setAttribute("value", "test value")
	expect(element.defaultValue).toBe("test value")

	// Test setting via property
	element.defaultValue = "new value"
	expect(element.defaultValue).toBe("new value")
	expect(element.getAttribute("value")).toBe("new value")

	// Test null value
	element.removeAttribute("value")
	expect(element.defaultValue).toBe("")
})

test("FormAssociatedElement can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()
	const attributeChangedCallbackHandler = vi.fn()

	class CustomFormAssociatedElement extends FormAssociatedElement {
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

	const elementName = `test-custom-form-associated`

	customElements.define(elementName, CustomFormAssociatedElement)

	const customElement = new CustomFormAssociatedElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("required", "")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)
})

test("FormAssociatedElement calls super.attributeChangedCallback", () => {
	const attributeChangedCallbackHandler = vi.fn()

	// Create a superclass that overrides attributeChangedCallback
	class SuperFormAssociatedElement extends HTMLElement {
		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			attributeChangedCallbackHandler(name, oldValue, newValue)
		}
	}

	// Create a subclass that overrides attributeChangedCallback
	class CustomFormElement extends FormAssociatedMixin(SuperFormAssociatedElement) {}

	customElements.define("test-custom-form-element", CustomFormElement)

	const customElement = new CustomFormElement()

	customElement.setAttribute("required", "")

	expect(attributeChangedCallbackHandler).toHaveBeenCalledWith("required", null, "")
})
