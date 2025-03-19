import { HTMLElement } from "../api/dom.ts"
import { InternalsMixin } from "../mixins/internals.ts"

export class InternalsElement extends InternalsMixin(HTMLElement) {}

export namespace InternalsElement {
	export type Constructor = InternalsMixin.Constructor
	export type Mixin = InternalsMixin.Mixin
}
