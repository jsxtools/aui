import type { FilePickerAcceptType } from "../ssr.ts"

import { createElement, useCallback } from "react"
import { FileAssociatedElement } from "../elements/file-associated.ts"
import { customElements } from "../ssr/custom-elements.ts"
import { without } from "./_without.ts"

customElements.define("a-file-associated", FileAssociatedElement)

export const FileAssociatedComponent = (props: FileAssociatedComponent.Props) =>
	createElement("a-file-associated", {
		...without(props, "excludeAcceptAllOption", "maxSize", "types", "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: props is treated immutably
		ref: useCallback(
			(current: FileAssociatedElement | null) => {
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

export namespace FileAssociatedComponent {
	export type Element = FileAssociatedElement

	export interface Props extends React.ComponentProps<"a-file-associated"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-file-associated": FileAssociatedElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-file-associated": React.DetailedHTMLProps<
				React.HTMLAttributes<FileAssociatedElement> & {
					defaultValue?: string
					disabled?: boolean
					name?: string
					required?: boolean

					excludeAcceptAllOption?: boolean
					maxSize?: number
					multiple?: boolean
					types?: FilePickerAcceptType[]
					value?: string | File | FormData
				},
				FileAssociatedElement
			>
		}
	}
}
