import { InternalsMixin } from "../mixins/internals-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides the ElementInternals API. */
export class InternalsElement extends InternalsMixin(HTMLElement) {}

export namespace InternalsElement {
	export type Constructor = InternalsMixin.Constructor
	export type Mixin = InternalsMixin.Mixin
}
