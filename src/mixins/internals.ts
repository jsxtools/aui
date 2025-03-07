// with-internals.ts
import type { CustomElementConstructor } from "../ssr/element.ts"

// The mixin function with proper typing
export const mixinInternals = <T extends CustomElementConstructor>(Element: T) =>
	class extends Element {
		internals: ElementInternals = super.attachInternals()

		attachInternals(): ElementInternals {
			return this.internals
		}
	} as unknown as T & mixinInternals.Constructor

export namespace mixinInternals {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		internals: ElementInternals
	}
}
