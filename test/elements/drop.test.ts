import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { DropElement } from "../../src/elements/drop.js"
import { DropMixin } from "../../src/mixins/drop.js"

let element: DropElement

beforeAll(async () => {
	customElements.define("test-drop", DropElement)

	element = new DropElement()
	element.textContent = "Drop here"

	document.body.appendChild(element)
})

afterAll(() => {
	document.body.removeChild(element)
})

test('DropElement handles "dragover" event', async () => {
	const dragOverEvent = new DragEvent("dragover", {
		bubbles: true,
		cancelable: true,
	})

	const preventDefault = vi.spyOn(dragOverEvent, "preventDefault")

	element.dispatchEvent(dragOverEvent)

	expect(preventDefault).toHaveBeenCalled()
})

test('DropElement adds "active-drop" state on dragenter', () => {
	const dragEnterEvent = new DragEvent("dragenter", {
		bubbles: true,
	})

	element.dispatchEvent(dragEnterEvent)

	expect(element.internals.states.has("active-drop")).toBe(true)

	element.dispatchEvent(
		new DragEvent("dragleave", {
			bubbles: true,
		}),
	)
})

test('DropElement removes "active-drop" state on dragleave', () => {
	// First add the state
	const dragEnterEvent = new DragEvent("dragenter", {
		bubbles: true,
	})
	element.dispatchEvent(dragEnterEvent)

	// Then remove it
	const dragLeaveEvent = new DragEvent("dragleave", {
		bubbles: true,
	})
	element.dispatchEvent(dragLeaveEvent)

	expect(element.internals.states.has("active-drop")).toBe(false)
})

test('DropElement removes "active-drop" state on drop', () => {
	// First add the state
	const dragEnterEvent = new DragEvent("dragenter", {
		bubbles: true,
	})

	element.dispatchEvent(dragEnterEvent)

	const dataTransfer = new DataTransfer()

	// 1x1 transparent GIF as a byte array
	const gifArray = new Uint8Array([
		0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c,
		0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
	])

	dataTransfer.items.add(new File([gifArray], "test.gif", { type: "image/gif" }))

	// Then drop
	const dropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer,
	})

	element.dispatchEvent(dropEvent)

	expect(element.internals.states.has("active-drop")).toBe(false)
})

test('DropElement dispatches "dropenter" / "dropleave" events', () => {
	const dragEnterEvent = new DragEvent("dragenter", { bubbles: true, cancelable: true })
	const dragEnterPreventDefault = vi.spyOn(dragEnterEvent, "preventDefault")
	const dragLeaveEvent = new DragEvent("dragleave", { bubbles: true, cancelable: true })
	const dragLeavePreventDefault = vi.spyOn(dragEnterEvent, "preventDefault")

	const dropEnterListener = vi.fn((event: DragEvent) => {
		event.preventDefault()
	})
	const dropLeaveListener = vi.fn((event: DragEvent) => {
		event.preventDefault()
	})

	element.addEventListener("dropenter", dropEnterListener)
	element.addEventListener("dropleave", dropLeaveListener)

	element.dispatchEvent(dragEnterEvent)

	expect(dropEnterListener).toHaveBeenCalled()
	expect(dragEnterPreventDefault).toHaveBeenCalled()

	element.dispatchEvent(dragLeaveEvent)

	expect(dropLeaveListener).toHaveBeenCalled()
	expect(dragLeavePreventDefault).toHaveBeenCalled()
})

test('DropElement handles "active-drop" state on multiple dragenter/dragleave events', () => {
	const dispatch = (name: "dragenter" | "dragleave") => element.dispatchEvent(new DragEvent(name, { bubbles: true }))

	expect(element.internals.states.has("active-drop")).toBe(false)

	dispatch("dragenter")

	expect(element.internals.states.has("active-drop")).toBe(true)

	dispatch("dragenter")

	expect(element.internals.states.has("active-drop")).toBe(true)

	dispatch("dragleave")

	expect(element.internals.states.has("active-drop")).toBe(true)

	dispatch("dragleave")

	expect(element.internals.states.has("active-drop")).toBe(false)
})

test("DropElement handles lifecycle with and without super methods", () => {
	// Create a base class without lifecycle methods
	class BaseElement extends HTMLElement {}

	// Create a class with lifecycle methods
	class BaseWithLifecycle extends HTMLElement {
		connectedCallback() {
			this.setAttribute("connected", "true")
		}

		disconnectedCallback() {
			this.removeAttribute("connected")
		}
	}

	// Create drop elements with both base classes
	class BasicDropElement extends DropMixin(BaseElement) {}
	class LifecycleDropElement extends DropMixin(BaseWithLifecycle) {}

	customElements.define("test-basic-drop", BasicDropElement)
	customElements.define("test-lifecycle-drop", LifecycleDropElement)

	const basicElement = new BasicDropElement()
	const lifecycleElement = new LifecycleDropElement()

	// Test element without super lifecycle methods
	document.body.appendChild(basicElement)

	expect(basicElement.hasAttribute("connected")).toBe(false)

	document.body.removeChild(basicElement)

	// Test element with super lifecycle methods
	document.body.appendChild(lifecycleElement)

	expect(lifecycleElement.hasAttribute("connected")).toBe(true)

	document.body.removeChild(lifecycleElement)

	expect(lifecycleElement.hasAttribute("connected")).toBe(false)
})
