import { HTMLElement } from "../api/dom.ts"
import { FileException, FileMixin } from "../mixins/file.ts"

export class FileElement extends FileMixin(HTMLElement) {}

export namespace FileElement {
	export type Constructor = FileMixin.Constructor
	export type Mixin = FileMixin.Mixin
}

export { FileException as FileError }
