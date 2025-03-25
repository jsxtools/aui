import type { FilePickerAcceptType } from "../api.ts"

import { createElement, useCallback } from "react"
import { customElements } from "../api/dom.ts"
import { FileElement, TransferFile } from "../elements/file.ts"
import { without } from "./_without.ts"

customElements.define("a-file", FileElement)

export const FileComponent = ({ ref, ...props }: FileComponent.Props) =>
	createElement("a-file", {
		...without(props, "maxSize", "types", "value"),
		// biome-ignore lint/correctness/useExhaustiveDependencies: they are immutable
		ref: useCallback(
			(current: FileElement | null) => {
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
			[props.maxSize, props.types, ref],
		),
	})

export namespace FileComponent {
	export type Element = FileElement

	export interface Props extends React.ComponentProps<"a-file"> {}
}

export { TransferFile }

declare global {
	interface HTMLElementTagNameMap {
		"a-file": FileElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-file": React.DetailedHTMLProps<
				React.HTMLAttributes<FileElement> & {
					maxSize?: number
					multiple?: boolean
					types?: FilePickerAcceptType[]
				},
				FileElement
			>
		}
	}
}
