import { mixinFileAssociated } from "../mixins/file-associated.ts"
import { HTMLElement } from "../ssr/element.ts"

export class FileAssociatedElement extends mixinFileAssociated(HTMLElement) {}

export namespace FileAssociatedElement {
	export type Constructor = typeof FileAssociatedElement

	export type Mixin = mixinFileAssociated.Mixin
}
