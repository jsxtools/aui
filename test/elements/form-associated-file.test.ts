import { userEvent } from "@vitest/browser/context"
import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { FormAssociatedFileElement } from "../../src/elements/form-associated-file.js"
import { TransferFile } from "../../src/mixins/file.js"

let form: HTMLFormElement
let element: FormAssociatedFileElement

beforeAll(() => {
	customElements.define("test-form-associated-file", FormAssociatedFileElement)

	form = document.createElement("form")
	element = new FormAssociatedFileElement()

	element.name = "test-file"
	element.tabIndex = 0
	element.textContent = "test"

	form.appendChild(element)

	document.body.appendChild(form)
})

afterAll(() => {
	document.body.removeChild(form)
})

test("FormAssociatedFileElement has correct default properties", () => {
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

test("FormAssociatedFileElement handles multiple attribute", () => {
	expect(element.multiple).toBe(false)

	element.setAttribute("multiple", "")
	expect(element.multiple).toBe(true)

	element.removeAttribute("multiple")
	expect(element.multiple).toBe(false)
})

test("FormAssociatedFileElement validates file types", async () => {
	element.types = [
		{
			description: "Images",
			accept: {
				"image/png": [".png"],
				"image/jpeg": [".jpg", ".jpeg"],
			},
		},
	]

	const validFile = new File(["test"], "test.png", { type: "image/png" })
	const invalidFile = new File(["test"], "test.txt", { type: "text/plain" })
	const invalidFileError = new TransferFile(invalidFile, { valid: false, typeMismatch: true }, "Unsupported file type")

	// Mock drop event with valid file
	const validDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	validDropEvent.dataTransfer!.items.add(validFile)
	validDropEvent.dataTransfer!.items.add(invalidFile)

	const inputEventSpy = vi.fn()
	const changeEventSpy = vi.fn()
	element.addEventListener("input", inputEventSpy)
	element.addEventListener("change", changeEventSpy)

	element.dispatchEvent(validDropEvent)

	expect(element.files).toEqual([new TransferFile(validFile), invalidFileError])
	expect(element.validity.valid).toBe(true)
	expect(inputEventSpy).toHaveBeenCalled()
	expect(changeEventSpy).toHaveBeenCalled()

	// Mock drop event with invalid file
	const invalidDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	invalidDropEvent.dataTransfer!.items.add(invalidFile)

	element.dispatchEvent(invalidDropEvent)

	expect(element.files).toEqual([new TransferFile(invalidFile, { valid: false, typeMismatch: true }, "Unsupported file type")])
	expect(element.validity.typeMismatch).toBe(true)
	expect(element.validationMessage).toBe("Unsupported file type")
})

test("FormAssociatedFileElement validates file size", () => {
	element.maxSize = 5 // 5 bytes max
	element.types = [{ description: "All Files", accept: { "*/*": [] } }]

	const largeFile = new File(["too large"], "large.txt", { type: "text/plain" })
	const smallFile = new File(["ok"], "small.txt", { type: "text/plain" })

	// Test large file
	const largeDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	largeDropEvent.dataTransfer!.items.add(largeFile)

	element.dispatchEvent(largeDropEvent)

	expect(element.files).toEqual([new TransferFile(largeFile, { valid: false, rangeOverflow: true }, "Unsupported file size")])
	expect(element.validity.rangeOverflow).toBe(true)
	expect(element.validationMessage).toBe("Unsupported file size")

	// Test small file
	const smallDropEvent = new DragEvent("drop", {
		bubbles: true,
		dataTransfer: new DataTransfer(),
	})
	smallDropEvent.dataTransfer!.items.add(smallFile)

	element.dispatchEvent(smallDropEvent)

	expect(element.files).toEqual([new TransferFile(smallFile)])
	expect(element.validity.valid).toBe(true)
})

test("FormAssociatedFileElement handles multiple files", () => {
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
	expect(element.validity.valid).toBe(true)
})

test("FormAssociatedFileElement detects files with missing types", () => {
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

	expect(element.files).toEqual([new TransferFile(fileWithMissingType, { valid: true }, "")])
	expect(element.validity.valid).toBe(true)
})

test("FormAssociatedFileElement handles click", async () => {
	const file = new File(["test"], "test.txt", { type: "text/plain" })
	const { showOpenFilePicker } = globalThis
	const fakeFilePicker = (globalThis.showOpenFilePicker = vi.fn().mockResolvedValue([
		{
			getFile: vi.fn().mockResolvedValue(file),
		},
	]))

	await userEvent.click(element)

	globalThis.showOpenFilePicker = showOpenFilePicker

	expect(fakeFilePicker).toHaveBeenCalled()
	expect(element.files).toEqual([new TransferFile(file, { valid: true }, "")])
})
