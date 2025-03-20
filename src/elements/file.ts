import { HTMLElement } from "../api/dom.ts"
import { FileException, FileMixin } from "../mixins/file.ts"

/** A Custom Element with file-drop and file-picker support. */
export class FileElement extends FileMixin(HTMLElement) {}

export namespace FileElement {
	export type Constructor = FileMixin.Constructor
	export type Mixin = FileMixin.Mixin
}

export { FileException as FileError }
