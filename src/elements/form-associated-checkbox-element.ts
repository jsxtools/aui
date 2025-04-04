import { FormAssociatedCheckboxMixin } from "../mixins/form-associated-checkbox-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides children observation support. */
export class FormAssociatedCheckboxElement extends FormAssociatedCheckboxMixin(HTMLElement) {}

export namespace FormAssociatedCheckboxElement {
	export type Constructor = FormAssociatedCheckboxMixin.Constructor
	export type Mixin = FormAssociatedCheckboxMixin.Mixin
}
