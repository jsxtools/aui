import type { FilePickerAcceptType } from "../ssr.ts"

import { createElement, useCallback } from "react"
import { FormAssociatedFileElement } from "../elements/form-associated-file.ts"
import { customElements } from "../ssr/custom-elements.ts"
import { without } from "./_without.ts"

customElements.define("a-form-associated-file", FormAssociatedFileElement)

export const FormAssociatedFileComponent = (props: FormAssociatedFileComponent.Props) =>
	createElement("a-form-associated-file", {
		...without(props, "excludeAcceptAllOption", "maxSize", "types", "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: props is treated immutably
		ref: useCallback(
			(current: FormAssociatedFileElement | null) => {
				if (current) {
					if ("excludeAcceptAllOption" in props) {
						current.excludeAcceptAllOption = props.excludeAcceptAllOption
					}

					if ("maxSize" in props) {
						current.maxSize = props.maxSize
					}

					if ("types" in props) {
						current.types = props.types
					}

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
			[props.excludeAcceptAllOption, props.maxSize, props.types, props.value, props.ref],
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
					value?: string
				},
				FormAssociatedFileElement
			>
		}
	}
}
