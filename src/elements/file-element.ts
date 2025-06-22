import { FileMixin, TransferFile } from "../mixins/file-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with file-drop and file-picker support. */
export class FileElement extends FileMixin(HTMLElement) {}

export namespace FileElement {
	export type Constructor = FileMixin.Constructor
	export type Mixin = FileMixin.Mixin
}

export { TransferFile }
