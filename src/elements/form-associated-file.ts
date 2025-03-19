import { HTMLElement } from "../api/dom.ts"
import { FormAssociatedFileMixin } from "../mixins/form-associated-file.ts"

export class FormAssociatedFileElement extends FormAssociatedFileMixin(HTMLElement) {}

export namespace FormAssociatedFileElement {
	export type Constructor = FormAssociatedFileMixin.Constructor
	export type Mixin = FormAssociatedFileMixin.Mixin
}
