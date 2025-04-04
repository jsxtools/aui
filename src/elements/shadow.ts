import { HTMLElement } from "../api/html-element.ts"
import { ShadowMixin } from "../mixins/shadow.ts"

/** A custom element that provides a configurable ShadowRoot. */
export class ShadowElement extends ShadowMixin(HTMLElement) {}

export namespace ShadowElement {
	export type Constructor = ShadowMixin.Constructor
	export type Mixin = ShadowMixin.Mixin
}
