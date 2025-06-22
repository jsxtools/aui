import { ToggleMixin } from "../mixins/toggle-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides a two-state button that can be on or off. */
export class ToggleElement extends ToggleMixin(HTMLElement) {}

export namespace ToggleElement {
	export type Constructor = ToggleMixin.Constructor
	export type Mixin = ToggleMixin.Mixin
}
