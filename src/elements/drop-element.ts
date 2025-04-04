import { DropMixin } from "../mixins/drop-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with drop support. */
export class DropElement extends DropMixin(HTMLElement) {}

export namespace DropElement {
	export type Constructor = DropMixin.Constructor
	export type Mixin = DropMixin.Mixin
}
