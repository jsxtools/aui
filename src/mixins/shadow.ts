import type { CustomElementConstructor } from "../ssr/element.ts"
import type { ShadowRootInit } from "../ssr/shadow.ts"

/** A mixin to provide a Shadow DOM with configurable options to a custom element. */
export const ShadowMixin = <T extends CustomElementConstructor>(Element: T, config: ShadowRootInit) =>
	class extends Element {
		shadowRoot = Object.assign(super.attachShadow(config), {
			innerHTML: config?.innerHTML ?? null,
			adoptedStyleSheets: config?.adoptedStyleSheets ?? [],
		}) as ShadowRoot

		attachShadow(): ShadowRoot {
			return this.shadowRoot
		}
	} as T & ShadowMixin.Constructor

export namespace ShadowMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends HTMLElement {
		shadowRoot: ShadowRoot
	}
}
