/// <reference types="@vitest/browser/matchers" />

import * as React from "react"

import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"
import { DropComponent } from "../../src/react/drop.js"

test("renders DropComponent with children", async () => {
	const testContent = "Test Content"
	const { getByText } = render(<DropComponent>{testContent}</DropComponent>)

	await expect.element(getByText(testContent)).toBeInTheDocument()
})

test("DropComponent handles drop events", async () => {
	const handleDrop = vi.fn()
	const result = render(<DropComponent onDropCapture={() => handleDrop()} />)
	const element = result.container.querySelector("a-drop")!

	expect(element).toBeDefined()

	element.dispatchEvent(new Event("drop"))

	expect(handleDrop).toHaveBeenCalled()
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const { container } = render(<DropComponent id={testId} className={className} data-testattr="test" />)

	const element = container.querySelector("a-drop")
	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
