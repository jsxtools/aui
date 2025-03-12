import { InternalsMixin } from "../mixins/internals.ts"
import { HTMLElement } from "../ssr/element.ts"

export class InternalsElement extends InternalsMixin(HTMLElement) {}

export namespace InternalsElement {
	export type Constructor = InternalsMixin.Constructor
	export type Mixin = InternalsMixin.Mixin
}
