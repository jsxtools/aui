import { mixinDrop } from "../mixins/drop.ts"
import { HTMLElement } from "../ssr/element.ts"

export class DropElement extends mixinDrop(HTMLElement) {}

export namespace DropElement {
	export type Constructor = typeof DropElement

	export type Mixin = mixinDrop.Mixin
}
