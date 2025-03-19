import { createElement } from "react"
import { customElements } from "../api/dom.ts"
import { DropElement } from "../elements/drop.ts"

customElements.define("a-drop", DropElement)

export const DropComponent = (props: DropComponent.Props) => createElement("a-drop", props)

export namespace DropComponent {
	export type Element = DropElement

	export interface Props extends React.ComponentProps<"a-drop"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-drop": DropElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-drop": React.DetailedHTMLProps<React.HTMLAttributes<DropElement> & {}, DropElement>
		}
	}
}
