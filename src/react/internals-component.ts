import { createElement } from "react"
import { InternalsElement } from "../elements/internals-element.ts"
import { customElements } from "../ssr/custom-elements.ts"

customElements.define("a-internals", InternalsElement)

/** A component that provides the ElementInternals API. */
export const InternalsComponent = (props: InternalsComponent.Props) => createElement("a-internals", props)

export namespace InternalsComponent {
	export type Element = InternalsElement

	export interface Props extends React.ComponentProps<"a-internals"> {}
}

declare global {
	interface HTMLElementTagNameMap {
		"a-internals": InternalsElement
	}
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"a-internals": React.DetailedHTMLProps<React.HTMLAttributes<InternalsElement> & {}, InternalsElement>
		}
	}
}
