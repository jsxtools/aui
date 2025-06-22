import { OptionMixin } from "../mixins/option-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with an easily styleable option. */
export class OptionElement extends OptionMixin(HTMLElement) {}

export namespace OptionElement {
	export type Constructor = OptionMixin.Constructor
	export type Mixin = OptionMixin.Mixin
}
