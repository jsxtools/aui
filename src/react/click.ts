import { createElement } from "react"
import { customElements } from "../api/custom-elements.ts"
import { ClickElement } from "../elements/click.ts"

customElements.define("a-click", ClickElement)

/** A component with keyboard-accessible click support. */
export const ClickComponent = (props: ClickComponent.Props) => createElement("a-click", props)

export namespace ClickComponent {
	export type Element = ClickElement

	export interface Props extends React.ComponentProps<"a-click"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-click": ClickElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-click": React.DetailedHTMLProps<React.HTMLAttributes<ClickElement> & {}, ClickElement>
		}
	}
}
