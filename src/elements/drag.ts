import { HTMLElement } from "../api/dom.ts"
import { DragMixin } from "../mixins/drag.ts"

/** A custom element with drag support. */
export class DragElement extends DragMixin(HTMLElement) {}

export namespace DragElement {
	export type Constructor = DragMixin.Constructor
	export type Mixin = DragMixin.Mixin
}
