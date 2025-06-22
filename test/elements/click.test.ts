import { userEvent } from "@vitest/browser/context"
import { afterAll, beforeAll, expect, test, vi } from "vitest"

import { ClickElement } from "../../src/elements/click-element.ts"
import { ClickMixin } from "../../src/mixins/click-mixin.ts"

let element: ClickElement

beforeAll(async () => {
	customElements.define("test-click", ClickElement)

	element = new ClickElement()

	element.setAttribute("tabindex", "0") // Make focusable
	element.textContent = "Click me"

	document.body.appendChild(element)

	await userEvent.tab()
})

afterAll(() => {
	document.body.removeChild(element)
})

test('ClickElement supports "click"', async () => {
	const clickHandler = vi.fn()

	element.addEventListener("click", clickHandler)

	await userEvent.click(element)

	element.removeEventListener("click", clickHandler)

	expect(clickHandler).toHaveBeenCalledTimes(1)
})

test("ClickElement detects preventDefault", async () => {
	const clickHandler = vi.fn()
	const preventDefaultSpy = vi.spyOn(Event.prototype, "preventDefault")

	element.addEventListener("click", clickHandler)

	await userEvent.keyboard("{Enter}")

	element.removeEventListener("click", clickHandler)

	expect(clickHandler).toHaveBeenCalledTimes(1)
	expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
})

test('ClickElement supports " " key on keyup', async () => {
	const clickHandler = vi.fn()

	element.addEventListener("click", clickHandler)

	await userEvent.keyboard(" ")

	element.removeEventListener("click", clickHandler)

	expect(clickHandler).toHaveBeenCalledTimes(1)
})

test('ClickElement ignores " " keyup with Alt modifier', async () => {
	const clickHandler = vi.fn()

	element.addEventListener("click", clickHandler)

	await userEvent.keyboard("{Alt>} {/Alt}")

	element.removeEventListener("click", clickHandler)

	expect(clickHandler).not.toHaveBeenCalled()
})

test('ClickElement ignores "a" key on keydown', async () => {
	const clickHandler = vi.fn()

	element.addEventListener("click", clickHandler)

	await userEvent.keyboard("a")

	element.removeEventListener("click", clickHandler)

	expect(clickHandler).toHaveBeenCalledTimes(0)
})

test("ClickElement can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()

	class CustomClickElement extends ClickElement {
		connectedCallback(): void {
			super.connectedCallback?.()

			connectedCallbackHandler()
		}

		disconnectedCallback(): void {
			super.disconnectedCallback?.()

			disconnectedCallbackHandler()
		}
	}

	const elementName = `test-click-element`

	customElements.define(elementName, CustomClickElement)

	const customElement = new CustomClickElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
})

test("ClickMixin can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()

	// Create a superclass that overrides attributeChangedCallback
	class SuperClickElement extends HTMLElement {
		connectedCallback(): void {
			connectedCallbackHandler()
		}

		disconnectedCallback(): void {
			disconnectedCallbackHandler()
		}
	}

	// Create a subclass that overrides attributeChangedCallback
	class CustomClickElement extends ClickMixin(SuperClickElement) {}

	customElements.define("test-super-custom-click-element", CustomClickElement)

	const customElement = new CustomClickElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
})
