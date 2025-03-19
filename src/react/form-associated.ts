import { createElement, useCallback } from "react"
import { customElements } from "../api/dom.ts"
import { FormAssociatedElement } from "../elements/form-associated.ts"

customElements.define("a-form-associated", FormAssociatedElement)

export const FormAssociatedComponent = ({ ref, ...props }: FormAssociatedComponent.Props) =>
	createElement("a-form-associated", {
		...props,
		ref: useCallback(
			(current: FormAssociatedElement | null) => {
				if (typeof ref === "function") {
					ref(current)
				} else if (ref && "current" in ref) {
					ref.current = current
				}
			},
			[ref],
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
				},
				FormAssociatedElement
			>
		}
	}
}
