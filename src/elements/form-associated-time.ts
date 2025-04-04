import { HTMLElement } from "../api/html-element.ts"
import { FormAssociatedTimeMixin } from "../mixins/form-associated-time.ts"

/** A custom element with an interface to manipulate time values with form association. */
export class FormAssociatedTimeElement extends FormAssociatedTimeMixin(HTMLElement) {}

export namespace FormAssociatedTimeElement {
	export type Constructor = FormAssociatedTimeMixin.Constructor
	export type Mixin = FormAssociatedTimeMixin.Mixin
}
