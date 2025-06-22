import { createElement, useCallback } from "react"
import { FormAssociatedTimeElement } from "../elements/form-associated-time-element.ts"
import { customElements } from "../ssr/custom-elements.ts"

customElements.define("a-form-associated-time", FormAssociatedTimeElement)

/** A component with form association and validation support. */
export const FormAssociatedTimeComponent = ({ ref, ...props }: FormAssociatedTimeComponent.Props) =>
	createElement("a-form-associated-time", {
		...props,
		ref: useCallback(
			(current: FormAssociatedTimeElement | null) => {
				if (typeof ref === "function") {
					ref(current)
				} else if (ref && "current" in ref) {
					ref.current = current
				}
			},
			[ref],
		),
	})

export namespace FormAssociatedTimeComponent {
	export type Element = FormAssociatedTimeElement

	export interface Props extends React.ComponentProps<"a-form-associated-time"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-form-associated-time": FormAssociatedTimeElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-form-associated-time": React.DetailedHTMLProps<
				React.HTMLAttributes<FormAssociatedTimeElement> & {
					defaultValue?: string
					disabled?: boolean
					name?: string
					required?: boolean
				},
				FormAssociatedTimeElement
			>
		}
	}
}
