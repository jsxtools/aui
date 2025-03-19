import { createElement } from "react"
import { customElements } from "../api/dom.ts"
import { ClickElement } from "../elements/click.ts"

customElements.define("a-click", ClickElement)

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
