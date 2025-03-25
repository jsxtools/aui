import { userEvent } from "@vitest/browser/context"
import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { FileElement } from "../../src/elements/file.js"
import { FileMixin, TransferFile } from "../../src/mixins/file.js"

let element: FileElement

beforeAll(() => {
	customElements.define("test-file", FileElement)

	element = new FileElement()

	element.tabIndex = 0
	element.textContent = "test"

	document.body.appendChild(element)
})

afterAll(() => {
	document.body.removeChild(element)
})

test("FileElement has correct default properties", () => {
	expect(element.maxSize).toBe(Number.POSITIVE_INFINITY)
	expect(element.multiple).toBe(false)
	expect(element.files).toEqual([])
	expect(element.types).toEqual([
		{
			description: "All Files",
			accept: {
				"*/*": [],
			},
		},
	])
})

test("FileElement handles multiple attribute", () => {
	expect(element.multiple).toBe(false)

	element.setAttribute("multiple", "")
	expect(element.multiple).toBe(true)

	element.removeAttribute("multiple")
	expect(element.multiple).toBe(false)
})

test("FileElement validates file types", async () => {
	element.types = [
		{
			description: "Images",
			accept: {
				"image/png": [".png"],
				"image/jpeg": [".jpg", ".jpeg"],
			},
		},
	]

	// Mock drop event with valid file
	const validDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	const validFile = new File(["test"], "test.png", { type: "image/png" })
	validDropEvent.dataTransfer!.items.add(validFile)

	const inputEventSpy = vi.fn()

	element.addEventListener("input", inputEventSpy)

	element.dispatchEvent(validDropEvent)

	expect(element.files).toEqual([new TransferFile(validFile)])
	expect(inputEventSpy).toHaveBeenCalled()

	// Mock drop event with invalid file

	const invalidDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	const invalidFile = new File(["test"], "test.txt", { type: "text/plain" })
	invalidDropEvent.dataTransfer!.items.add(invalidFile)

	element.dispatchEvent(invalidDropEvent)

	expect(element.files).toEqual([new TransferFile(invalidFile, { valid: false, typeMismatch: true }, "Unsupported file type")])
})

test("FileElement validates file size", () => {
	element.maxSize = 5 // 5 bytes max
	element.types = [{ description: "All Files", accept: { "*/*": [] } }]

	// Test with a large file

	const largeDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})

	const largeFile = new File(["too large"], "large.txt", { type: "text/plain" })

	largeDropEvent.dataTransfer!.items.add(largeFile)

	element.dispatchEvent(largeDropEvent)

	expect(element.files).toEqual([new TransferFile(largeFile, { valid: false, rangeOverflow: true }, "Unsupported file size")])

	// Test with a small file

	const smallDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})

	const smallFile = new File(["ok"], "small.txt", { type: "text/plain" })

	smallDropEvent.dataTransfer!.items.add(smallFile)

	element.dispatchEvent(smallDropEvent)

	expect(element.files).toEqual([new TransferFile(smallFile)])
})

test("FileElement handles multiple files", () => {
	element.multiple = true
	element.maxSize = Number.POSITIVE_INFINITY
	element.types = [{ description: "All Files", accept: { "*/*": [] } }]

	const file1 = new File(["test1"], "test1.txt", { type: "text/plain" })
	const file2 = new File(["test2"], "test2.txt", { type: "text/plain" })

	const dropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	dropEvent.dataTransfer!.items.add(file1)
	dropEvent.dataTransfer!.items.add(file2)

	element.dispatchEvent(dropEvent)

	expect(element.files).toEqual([new TransferFile(file1), new TransferFile(file2)])
})

test("FileElement detects files with missing types", () => {
	element.multiple = true
	element.maxSize = Number.POSITIVE_INFINITY
	element.types = [{ description: "All Files", accept: { "text/plain": [".txt"] } }]

	const fileWithMissingType = new File(["test1"], "test1.txt", { type: "" })
	const dataTransfer = new DataTransfer()

	dataTransfer.items.add(fileWithMissingType)

	element.dispatchEvent(
		new DragEvent("drop", {
			bubbles: true,
			dataTransfer,
		}),
	)

	expect(element.files).toEqual([new TransferFile(fileWithMissingType)])
})

test("FileElement handles click", async () => {
	const { showOpenFilePicker } = globalThis
	const file = new File(["test"], "test.txt", { type: "text/plain" })

	const fakeFilePicker = (globalThis.showOpenFilePicker = vi.fn().mockResolvedValue([
		{
			getFile() {
				return file
			},
		},
	]))

	await userEvent.click(element)

	globalThis.showOpenFilePicker = showOpenFilePicker

	expect(fakeFilePicker).toHaveBeenCalled()
	expect(element.files).toEqual([new TransferFile(file)])
})

test("FileElement handles abort", async () => {
	const { showOpenFilePicker } = globalThis

	const fakeFilePicker = (globalThis.showOpenFilePicker = vi.fn().mockResolvedValue([
		{
			async getFile() {
				throw new Error("Abort")
			},
		},
	]))

	await userEvent.click(element)

	globalThis.showOpenFilePicker = showOpenFilePicker

	expect(fakeFilePicker).toHaveBeenCalled()
})

test("FileElement can be extended", () => {
	const connectedCallbackHandler = vi.fn()
	const disconnectedCallbackHandler = vi.fn()
	const attributeChangedCallbackHandler = vi.fn()

	class CustomFileElement extends FileElement {
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

	customElements.define(elementName, CustomFileElement)

	const customElement = new CustomFileElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("multiple", "")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)
})

test("FileMixin can be extended", () => {
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

	class CustomFileElement extends FileMixin(SuperElement) {}

	const elementName = `test-custom-file`

	customElements.define(elementName, CustomFileElement)

	const customElement = new CustomFileElement()

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	document.body.appendChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(0)

	customElement.setAttribute("multiple", "")

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(0)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)

	document.body.removeChild(customElement)

	expect(connectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(disconnectedCallbackHandler).toHaveBeenCalledTimes(1)
	expect(attributeChangedCallbackHandler).toHaveBeenCalledTimes(1)
})
