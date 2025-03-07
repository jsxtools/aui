import type { CustomElementConstructor } from "../ssr/element.ts"
import type { ShadowRootInit } from "../ssr/shadow.ts"

export const mixinShadow = <T extends CustomElementConstructor>(Element: T, config: ShadowRootInit) =>
	class extends Element {
		shadowRoot = Object.assign(super.attachShadow(config), {
			innerHTML: config?.innerHTML ?? null,
			adoptedStyleSheets: config?.adoptedStyleSheets ?? [],
		}) as ShadowRoot

		attachShadow(): ShadowRoot {
			return this.shadowRoot
		}
	} as unknown as T & mixinShadow.Constructor

export namespace mixinShadow {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends HTMLElement {
		shadowRoot: ShadowRoot
	}
}
