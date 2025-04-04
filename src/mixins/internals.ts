import type { CustomElementConstructor } from "../types.ts"

/** Mixin to provide the ElementInternals API to a custom element. */
export const InternalsMixin = <T extends CustomElementConstructor>(Element: T): T & InternalsMixin.Constructor =>
	class extends Element {
		internals: ElementInternals = super.attachInternals()

		attachInternals(): ElementInternals {
			return this.internals
		}
	}

export namespace InternalsMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		/** Interface for managing the element’s internal states, such as ARIA roles and ARIA labels, or participating in form submissions and validations. [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) */
		internals: ElementInternals
	}
}
