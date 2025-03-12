import type { CustomElementConstructor } from "../ssr/element.ts"

/** Mixin to provide the ElementInternals API to a custom element. */
export const InternalsMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends Element {
		internals: ElementInternals = super.attachInternals()

		attachInternals(): ElementInternals {
			return this.internals
		}
	} as T & InternalsMixin.Constructor

export namespace InternalsMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		internals: ElementInternals
	}
}
