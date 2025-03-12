import { ClickMixin } from "../mixins/click.ts"
import { HTMLElement } from "../ssr/element.ts"

/** A Custom Element that provides keyboard-accessible click support. */
export class ClickElement extends ClickMixin(HTMLElement) {}

export namespace ClickElement {
	export type Mixin = ClickMixin.Mixin
}
