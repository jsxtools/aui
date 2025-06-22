import { AccordionMixin } from "../mixins/accordion-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with collapsible sections by heading. */
export class AccordionElement extends AccordionMixin(HTMLElement) {}

export namespace AccordionElement {
	export type Constructor = AccordionMixin.Constructor
	export type Mixin = AccordionMixin.Mixin
}
