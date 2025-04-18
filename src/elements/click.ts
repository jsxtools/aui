import { HTMLElement } from "../api/html-element.ts"
import { ClickMixin } from "../mixins/click.ts"

/** A custom element with keyboard-accessible click support. */
export class ClickElement extends ClickMixin(HTMLElement) {}

export namespace ClickElement {
	export type Constructor = ClickMixin.Constructor
	export type Mixin = ClickMixin.Mixin
}
