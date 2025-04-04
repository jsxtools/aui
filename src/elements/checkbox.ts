import { HTMLElement } from "../api/html-element.ts"
import { FormAssociatedCheckboxMixin } from "../mixins/checkbox.ts"

/** A custom element that provides children observation support. */
export class FormAssociatedCheckboxElement extends FormAssociatedCheckboxMixin(HTMLElement) {}

export namespace FormAssociatedCheckboxElement {
	export type Constructor = FormAssociatedCheckboxMixin.Constructor
	export type Mixin = FormAssociatedCheckboxMixin.Mixin
}
