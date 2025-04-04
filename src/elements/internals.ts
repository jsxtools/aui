import { HTMLElement } from "../api/html-element.ts"
import { InternalsMixin } from "../mixins/internals.ts"

/** A custom element that provides the ElementInternals API. */
export class InternalsElement extends InternalsMixin(HTMLElement) {}

export namespace InternalsElement {
	export type Constructor = InternalsMixin.Constructor
	export type Mixin = InternalsMixin.Mixin
}
