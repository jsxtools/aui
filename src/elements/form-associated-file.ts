import { FormAssociatedFileMixin } from "../mixins/form-associated-file.ts"
import { HTMLElement } from "../ssr/element.ts"

export class FormAssociatedFileElement extends FormAssociatedFileMixin(HTMLElement) {}

export namespace FormAssociatedFileElement {
	export type Constructor = typeof FormAssociatedFileElement

	export type Mixin = FormAssociatedFileMixin.Mixin
}
