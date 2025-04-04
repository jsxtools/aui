import type { FilePickerAcceptType } from "show-open-file-picker/types"

import { createElement, useCallback } from "react"
import { FormAssociatedFileElement } from "../elements/form-associated-file-element.ts"
import { customElements } from "../ssr/custom-elements.ts"
import { without } from "./_without.ts"

customElements.define("a-form-associated-file", FormAssociatedFileElement)

/** A component with file-drop & file-picker support, and form association & validation. */
export const FormAssociatedFileComponent = ({ ref, ...props }: FormAssociatedFileComponent.Props) =>
	createElement("a-form-associated-file", {
		...without(props, "excludeAcceptAllOption", "maxSize", "types", "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: they are immutable
		ref: useCallback(
			(current: FormAssociatedFileElement | null) => {
				if (current) {
					if ("maxSize" in props) {
						current.maxSize = props.maxSize
					}

					if ("types" in props) {
						current.types = props.types
					}
				}

				if (typeof ref === "function") {
					ref(current)
				} else if (ref && "current" in ref) {
					ref.current = current
				}
			},
			[ref, props.excludeAcceptAllOption, props.maxSize, props.types],
		),
	})

export namespace FormAssociatedFileComponent {
	export type Element = FormAssociatedFileElement

	export interface Props extends React.ComponentProps<"a-form-associated-file"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-form-associated-file": FormAssociatedFileElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-form-associated-file": React.DetailedHTMLProps<
				React.HTMLAttributes<FormAssociatedFileElement> & {
					defaultValue?: string
					disabled?: boolean
					name?: string
					required?: boolean

					excludeAcceptAllOption?: boolean
					maxSize?: number
					multiple?: boolean
					types?: FilePickerAcceptType[]
				},
				FormAssociatedFileElement
			>
		}
	}
}
