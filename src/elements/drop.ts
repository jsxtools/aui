import { HTMLElement } from "../api/dom.ts"
import { DropMixin } from "../mixins/drop.ts"

/** A custom element with drop support. */
export class DropElement extends DropMixin(HTMLElement) {}

export namespace DropElement {
	export type Constructor = DropMixin.Constructor
	export type Mixin = DropMixin.Mixin
}
