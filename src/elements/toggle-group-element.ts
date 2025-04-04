import { ToggleGroupMixin } from "../mixins/toggle-group-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides a shared state to a series of toggle buttons. */
export class ToggleGroupElement extends ToggleGroupMixin(HTMLElement) {}

export namespace ToggleGroupElement {
	export type Constructor = ToggleGroupMixin.Constructor
	export type Mixin = ToggleGroupMixin.Mixin
}
