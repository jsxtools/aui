import { HTMLElement } from "../api/html-element.ts"
import { FormAssociatedFileMixin } from "../mixins/form-associated-file.ts"

/** A custom element with file-drop & file-picker support, and form association & validation. */
export class FormAssociatedFileElement extends FormAssociatedFileMixin(HTMLElement) {}

export namespace FormAssociatedFileElement {
	export type Constructor = FormAssociatedFileMixin.Constructor
	export type Mixin = FormAssociatedFileMixin.Mixin
}
