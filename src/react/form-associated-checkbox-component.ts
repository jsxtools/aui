import { createElement, useCallback } from "react"
import { FormAssociatedCheckboxElement } from "../elements/form-associated-checkbox-element.ts"
import { customElements } from "../ssr/custom-elements.ts"
import { without } from "./_without.ts"

customElements.define("a-form-associated-checkbox", FormAssociatedCheckboxElement)

/** A component with form association and validation support. */
export const FormAssociatedCheckboxComponent = ({ ref, ...props }: FormAssociatedCheckboxComponent.Props) =>
	createElement("a-form-associated-checkbox", {
		...without(props, "checked", "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: they are immutable
		ref: useCallback(
			(current: FormAssociatedCheckboxElement | null) => {
				if (current) {
					if ("checked" in props) {
						current.checked = props.checked
					}

					if ("value" in props) {
						current.value = props.value
					}
				}

				if (typeof ref === "function") {
					ref(current)
				} else if (ref && "current" in ref) {
					ref.current = current
				}
			},
			[ref, props.checked, props.value],
		),
	})

export namespace FormAssociatedCheckboxComponent {
	export type Element = FormAssociatedCheckboxElement

	export interface Props extends React.ComponentProps<"a-form-associated-checkbox"> {
		checked?: boolean
		value?: string
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-form-associated-checkbox": FormAssociatedCheckboxElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-form-associated-checkbox": React.DetailedHTMLProps<
				React.HTMLAttributes<FormAssociatedCheckboxElement> & {
					defaultValue?: string
					disabled?: boolean
					name?: string
					required?: boolean
				},
				FormAssociatedCheckboxElement
			>
		}
	}
}
