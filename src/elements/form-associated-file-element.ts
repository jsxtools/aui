import { FormAssociatedFileMixin } from "../mixins/form-associated-file-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with file-drop & file-picker support, and form association & validation. */
export class FormAssociatedFileElement extends FormAssociatedFileMixin(HTMLElement) {}

export namespace FormAssociatedFileElement {
	export type Constructor = FormAssociatedFileMixin.Constructor
	export type Mixin = FormAssociatedFileMixin.Mixin
}
