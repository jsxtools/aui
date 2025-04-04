import { ClickMixin } from "../mixins/click-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with keyboard-accessible click support. */
export class ClickElement extends ClickMixin(HTMLElement) {}

export namespace ClickElement {
	export type Constructor = ClickMixin.Constructor
	export type Mixin = ClickMixin.Mixin
}
