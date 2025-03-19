import { HTMLElement } from "../api/dom.ts"
import { FormAssociatedMixin } from "../mixins/form-associated.ts"

export class FormAssociatedElement extends FormAssociatedMixin(HTMLElement) {}

export namespace FormAssociatedElement {
	export type Constructor = FormAssociatedMixin.Constructor
	export type Mixin = FormAssociatedMixin.Mixin
}
