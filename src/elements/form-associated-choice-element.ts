import { FormAssociatedChoiceMixin } from "../mixins/form-associated-choice-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides children observation support. */
export class FormAssociatedChoiceElement extends FormAssociatedChoiceMixin(HTMLElement) {}

export namespace FormAssociatedChoiceElement {
	export type Constructor = FormAssociatedChoiceMixin.Constructor
	export type Mixin = FormAssociatedChoiceMixin.Mixin
}
