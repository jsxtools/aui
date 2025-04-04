import { HTMLElement } from "../api/html-element.ts"
import { FileMixin, TransferFile } from "../mixins/file.ts"

/** A custom element with file-drop and file-picker support. */
export class FileElement extends FileMixin(HTMLElement) {}

export namespace FileElement {
	export type Constructor = FileMixin.Constructor
	export type Mixin = FileMixin.Mixin
}

export { TransferFile }
