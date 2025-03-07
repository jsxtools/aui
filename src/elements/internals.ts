import { mixinInternals } from "../mixins/internals.ts"
import { HTMLElement } from "../ssr/element.ts"

export class InternalsElement extends mixinInternals(HTMLElement) {}

export namespace InternalsElement {
	export type Mixin = mixinInternals.Mixin
}
