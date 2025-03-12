import { DropMixin } from "../mixins/drop.ts"
import { HTMLElement } from "../ssr/element.ts"

/** A custom element that provides */
export class DropElement extends DropMixin(HTMLElement) {}

export namespace DropElement {
	export type Constructor = typeof DropElement

	export type Mixin = DropMixin.Mixin
}
