/// <reference types="@vitest/browser/matchers" />

import * as React from "react"

import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"

import { DragComponent } from "../../src/react/drag-component.ts"

test("renders DragComponent with children", async () => {
	const testContent = "Test Content"
	const { getByText } = render(<DragComponent>{testContent}</DragComponent>)

	await expect.element(getByText(testContent)).toBeInTheDocument()
})

test("DragComponent handles drag events", async () => {
	const handleDragStart = vi.fn()
	const result = render(<DragComponent onDragStartCapture={() => handleDragStart()} />)
	const element = result.container.querySelector("a-drag")!

	expect(element).toBeDefined()

	element.dispatchEvent(new Event("dragstart"))

	expect(handleDragStart).toHaveBeenCalled()
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const { container } = render(<DragComponent id={testId} className={className} data-testattr="test" />)

	const element = container.querySelector("a-drag")
	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
