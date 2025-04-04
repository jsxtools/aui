import { DragMixin } from "../mixins/drag-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with drag support. */
export class DragElement extends DragMixin(HTMLElement) {}

export namespace DragElement {
	export type Constructor = DragMixin.Constructor
	export type Mixin = DragMixin.Mixin
}
