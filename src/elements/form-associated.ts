import { FormAssociatedMixin } from "../mixins/form-associated.ts"
import { HTMLElement } from "../ssr/element.ts"

export class FormAssociatedElement extends FormAssociatedMixin(HTMLElement) {}

export namespace FormAssociatedElement {
	export type Constructor = FormAssociatedMixin.Constructor
	export type Mixin = FormAssociatedMixin.Mixin
}
