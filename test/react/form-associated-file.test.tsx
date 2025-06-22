/// <reference types="@vitest/browser/matchers" />

import type { FormAssociatedFileElement } from "../../src/elements/form-associated-file-element.ts"

import * as React from "react"

import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"

import { FormAssociatedFileComponent } from "../../src/react/form-associated-file-component.ts"

test("renders FormAssociatedFileComponent with children", async () => {
	const testContent = "Test Content"
	const result = render(<FormAssociatedFileComponent>{testContent}</FormAssociatedFileComponent>)

	await expect.element(result.getByText(testContent)).toBeInTheDocument()
})

test("FormAssociatedFileComponent has form association", async () => {
	const formId = "test-form"
	const result = render(
		<form id={formId}>
			<FormAssociatedFileComponent name="test-file" />
		</form>,
	)
	const element = result.container.querySelector("a-form-associated-file")

	expect(element).toBeDefined()
	expect(element?.form).toBeDefined()
	expect(element?.form?.id).toBe(formId)
})

test("handles file selection", async () => {
	const handleChange = vi.fn()
	const result = render(<FormAssociatedFileComponent onChange={handleChange} />)
	const element = result.container.querySelector("a-form-associated-file")!

	expect(element).toBeDefined()

	const file = new File(["test"], "test.txt", { type: "text/plain" })
	const dataTransfer = new DataTransfer()

	dataTransfer.items.add(file)

	element.dispatchEvent(new DragEvent("drop", { dataTransfer }))

	expect(handleChange).toHaveBeenCalled()
})

test("handles function ref with additional properties", async () => {
	const refCallback = vi.fn()
	const result = render(
		<FormAssociatedFileComponent ref={refCallback} excludeAcceptAllOption={true} maxSize={1024} types={[{ description: "Text", accept: { "text/plain": [".txt"] } }]} />,
	)
	const element = result.container.querySelector("a-form-associated-file")

	expect(element).toBeDefined()
	expect(refCallback).toHaveBeenCalledWith(element)
	expect(element?.maxSize).toBe(1024)
	expect(element?.types).toEqual([{ description: "Text", accept: { "text/plain": [".txt"] } }])
})

test("handles object ref with additional properties", async () => {
	const ref = React.createRef<FormAssociatedFileElement>()
	const result = render(
		<FormAssociatedFileComponent ref={ref} excludeAcceptAllOption={true} maxSize={1024} types={[{ description: "Text", accept: { "text/plain": [".txt"] } }]} />,
	)
	const element = result.container.querySelector("a-form-associated-file")

	expect(element).toBeDefined()
	expect(ref.current).toBe(element)
	expect(element?.maxSize).toBe(1024)
	expect(element?.types).toEqual([{ description: "Text", accept: { "text/plain": [".txt"] } }])
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const result = render(<FormAssociatedFileComponent id={testId} className={className} data-testattr="test" />)
	const element = result.container.querySelector("a-form-associated-file")

	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
