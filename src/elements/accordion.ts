import { HTMLElement } from "../api/html-element.ts"
import { AccordionMixin } from "../mixins/accordion.ts"

/** A custom element with collapsible sections by heading. */
export class AccordionElement extends AccordionMixin(HTMLElement) {}

export namespace AccordionElement {
	export type Constructor = AccordionMixin.Constructor
	export type Mixin = AccordionMixin.Mixin
}
