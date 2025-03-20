/// <reference types="@vitest/browser/matchers" />

import type { FileElement } from "../../src/elements/file.js"

import * as React from "react"

import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"
import { FileComponent } from "../../src/react/file.js"

test("renders FileComponent with children", async () => {
	const testContent = "Test Content"
	const result = render(<FileComponent>{testContent}</FileComponent>)

	await expect.element(result.getByText(testContent)).toBeInTheDocument()
})

test("FileComponent has form association", async () => {
	const testId = "test-id"
	const result = render(<FileComponent id={testId} />)
	const element = result.container.querySelector("a-file")

	expect(element).toBeDefined()
	expect(element?.id).toBe(testId)
})

test("handles file selection", async () => {
	const handleInput = vi.fn()
	const result = render(<FileComponent onInput={handleInput} />)
	const element = result.container.querySelector("a-file")!

	expect(element).toBeDefined()

	const file = new File(["test"], "test.txt", { type: "text/plain" })
	const dataTransfer = new DataTransfer()

	dataTransfer.items.add(file)

	element.dispatchEvent(new DragEvent("drop", { dataTransfer }))

	expect(handleInput).toHaveBeenCalled()
})

test("handles function ref with additional properties", async () => {
	const refCallback = vi.fn()
	const result = render(<FileComponent ref={refCallback} maxSize={1024} types={[{ description: "Text", accept: { "text/plain": [".txt"] } }]} />)
	const element = result.container.querySelector("a-file")

	expect(element).toBeDefined()
	expect(refCallback).toHaveBeenCalledWith(element)
	expect(element?.maxSize).toBe(1024)
	expect(element?.types).toEqual([{ description: "Text", accept: { "text/plain": [".txt"] } }])
})

test("handles object ref with additional properties", async () => {
	const ref = React.createRef<FileElement>()
	const result = render(<FileComponent ref={ref} maxSize={1024} types={[{ description: "Text", accept: { "text/plain": [".txt"] } }]} />)
	const element = result.container.querySelector("a-file")

	expect(element).toBeDefined()
	expect(ref.current).toBe(element)
	expect(element?.maxSize).toBe(1024)
	expect(element?.types).toEqual([{ description: "Text", accept: { "text/plain": [".txt"] } }])
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const result = render(<FileComponent id={testId} className={className} data-testattr="test" />)
	const element = result.container.querySelector("a-file")

	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
