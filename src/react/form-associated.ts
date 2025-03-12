import { createElement, useCallback } from "react"
import { FormAssociatedElement } from "../elements/form-associated.ts"
import { customElements } from "../ssr/custom-elements.ts"
import { without } from "./_without.ts"

customElements.define("a-form-associated", FormAssociatedElement)

export const FormAssociatedComponent = (props: FormAssociatedComponent.Props) =>
	createElement("a-form-associated-file", {
		...without(props, "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: props is treated immutably
		ref: useCallback(
			(current: FormAssociatedElement | null) => {
				if (current) {
					if ("value" in props) {
						current.value = props.value
					}
				}

				if (typeof props.ref === "function") {
					props.ref(current)
				} else if (props.ref && "current" in props.ref) {
					props.ref.current = current
				}
			},
			[props.value, props.ref],
		),
	})

export namespace FormAssociatedComponent {
	export type Element = FormAssociatedElement

	export interface Props extends React.ComponentProps<"a-form-associated"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-form-associated": FormAssociatedElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-form-associated": React.DetailedHTMLProps<
				React.HTMLAttributes<FormAssociatedElement> & {
					defaultValue?: string
					disabled?: boolean
					name?: string
					required?: boolean
					value?: string
				},
				FormAssociatedElement
			>
		}
	}
}
