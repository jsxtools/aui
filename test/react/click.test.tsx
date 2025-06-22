/// <reference types="@vitest/browser/matchers" />

import * as React from "react"

import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"

import { ClickComponent } from "../../src/react/click-component.ts"

test("renders ClickComponent with children", async () => {
	const testContent = "Test Content"
	const { getByText } = render(<ClickComponent>{testContent}</ClickComponent>)

	await expect.element(getByText(testContent)).toBeInTheDocument()
})

test("ClickComponent handles click events", async () => {
	const handleClick = vi.fn()
	const { container } = render(<ClickComponent onClick={handleClick} />)

	const element = container.querySelector("a-click")
	expect(element).toBeDefined()

	await element?.click()
	expect(handleClick).toHaveBeenCalled()
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const { container } = render(<ClickComponent id={testId} className={className} data-testattr="test" />)

	const element = container.querySelector("a-click")
	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
