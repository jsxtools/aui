import * as React from "react"
import { expect, test, vi } from "vitest"
import { render } from "vitest-browser-react"
import type { FormAssociatedElement } from "../../src/elements/form-associated.js"
import { FormAssociatedComponent } from "../../src/react/form-associated.js"

test("renders FormAssociatedComponent with children", async () => {
	const testContent = "Test Content"
	const result = render(<FormAssociatedComponent>{testContent}</FormAssociatedComponent>)

	await expect.element(result.getByText(testContent)).toBeInTheDocument()
})

test("FormAssociatedComponent has form association", async () => {
	const formId = "test-form"
	const result = render(
		<form id={formId}>
			<FormAssociatedComponent name="test-input" />
		</form>,
	)

	const element = result.container.querySelector("a-form-associated")

	expect(element).toBeDefined()
	expect(element?.form).toBeDefined()
	expect(element?.form?.id).toBe(formId)
})

test("handles function ref", async () => {
	const refCallback = vi.fn()
	const result = render(<FormAssociatedComponent ref={refCallback} />)
	const element = result.container.querySelector("a-form-associated")

	expect(element).toBeDefined()
	expect(refCallback).toHaveBeenCalledWith(element)
})

test("handles object ref", async () => {
	const ref = React.createRef<FormAssociatedElement>()
	const result = render(<FormAssociatedComponent ref={ref} />)
	const element = result.container.querySelector("a-form-associated")

	expect(element).toBeDefined()
	expect(ref.current).toBe(element)
})

test("passes through HTML attributes", async () => {
	const testId = "test-id"
	const className = "test-class"
	const result = render(<FormAssociatedComponent id={testId} className={className} data-testattr="test" />)
	const element = result.container.querySelector("a-form-associated")

	expect(element).toHaveAttribute("id", testId)
	expect(element).toHaveAttribute("class", className)
	expect(element).toHaveAttribute("data-testattr", "test")
})
