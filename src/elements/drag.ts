import { HTMLElement } from "../api/html-element.ts"
import { DragMixin } from "../mixins/drag.ts"

/** A custom element with drag support. */
export class DragElement extends DragMixin(HTMLElement) {}

export namespace DragElement {
	export type Constructor = DragMixin.Constructor
	export type Mixin = DragMixin.Mixin
}
