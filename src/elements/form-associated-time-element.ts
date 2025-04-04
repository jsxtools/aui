import { FormAssociatedTimeMixin } from "../mixins/form-associated-time-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with an interface to manipulate time values with form association. */
export class FormAssociatedTimeElement extends FormAssociatedTimeMixin(HTMLElement) {}

export namespace FormAssociatedTimeElement {
	export type Constructor = FormAssociatedTimeMixin.Constructor
	export type Mixin = FormAssociatedTimeMixin.Mixin
}
