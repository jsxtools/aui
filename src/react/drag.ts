import { createElement } from "react"
import { customElements } from "../api/custom-elements.ts"
import { DragElement } from "../elements/drag.ts"

customElements.define("a-drag", DragElement)

/** A component with drag support. */
export const DragComponent = (props: DragComponent.Props) => createElement("a-drag", props)

export namespace DragComponent {
	export type Element = DragElement

	export interface Props extends React.ComponentProps<"a-drag"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-drag": DragElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-drag": React.DetailedHTMLProps<React.HTMLAttributes<DragElement> & {}, DragElement>
		}
	}
}
