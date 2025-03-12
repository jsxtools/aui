import * as React from "react"

import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import { InternalsComponent } from "../../src/react/internals.js"

test("renders InternalsComponent with children", async () => {
	const testContent = "Test Content"
	const { getByText } = render(<InternalsComponent>{testContent}</InternalsComponent>)

	await expect.element(getByText(testContent)).toBeInTheDocument()
})

test("InternalsComponent element has internals API", async () => {
	const { container } = render(<InternalsComponent />)

	const element = container.querySelector("a-internals")
	expect(element).toBeDefined()
	expect(element).toBeInstanceOf(HTMLElement)

	// Access the internals property
	const internalsElement = element as any // Type assertion needed for test
	expect(internalsElement.internals).toBeDefined()
	expect(internalsElement.internals).toBeInstanceOf(ElementInternals)

	// Test attachInternals method
	const attachedInternals = internalsElement.attachInternals()
	expect(attachedInternals).toBe(internalsElement.internals)
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const { container } = render(<InternalsComponent id={testId} className={className} data-testattr="test" />)

	const element = container.querySelector("a-internals")
	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
