import { ContextConsumerMixin, ContextProviderMixin } from "../mixins/context-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that allows context callbacks. */
export class ContextConsumerElement extends ContextConsumerMixin(HTMLElement) {}

export namespace ContextConsumerElement {
	export type Constructor = ContextConsumerMixin.Constructor
	export type Mixin = ContextConsumerMixin.Mixin
}

/** Element that allows context assignment. */
export class ContextProviderElement extends ContextProviderMixin(HTMLElement) {}

export namespace ContextProviderElement {
	export type Constructor = ContextProviderMixin.Constructor
	export type Mixin = ContextProviderMixin.Mixin
}
