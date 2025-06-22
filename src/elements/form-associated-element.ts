import { FormAssociatedMixin } from "../mixins/form-associated-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with form association and validation support. */
export class FormAssociatedElement extends FormAssociatedMixin(HTMLElement) {}

export namespace FormAssociatedElement {
	export type Constructor = FormAssociatedMixin.Constructor
	export type Mixin = FormAssociatedMixin.Mixin
}
