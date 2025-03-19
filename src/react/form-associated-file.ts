import type { FilePickerAcceptType } from "../api.ts"

import { createElement, useCallback } from "react"
import { customElements } from "../api/dom.ts"
import { FormAssociatedFileElement } from "../elements/form-associated-file.ts"
import { without } from "./_without.ts"

customElements.define("a-form-associated-file", FormAssociatedFileElement)

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
			[props.excludeAcceptAllOption, props.maxSize, props.types, ref],
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
