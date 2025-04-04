import { HTMLElement } from "../api/html-element.ts"
import { FormAssociatedMixin } from "../mixins/form-associated.ts"

/** A custom element with form association and validation support. */
export class FormAssociatedElement extends FormAssociatedMixin(HTMLElement) {}

export namespace FormAssociatedElement {
	export type Constructor = FormAssociatedMixin.Constructor
	export type Mixin = FormAssociatedMixin.Mixin
}
