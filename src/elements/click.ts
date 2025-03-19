import { HTMLElement } from "../api/dom.ts"
import { ClickMixin } from "../mixins/click.ts"

/** A Custom Element that provides keyboard-accessible click support. */
export class ClickElement extends ClickMixin(HTMLElement) {}

export namespace ClickElement {
	export type Constructor = ClickMixin.Constructor
	export type Mixin = ClickMixin.Mixin
}
