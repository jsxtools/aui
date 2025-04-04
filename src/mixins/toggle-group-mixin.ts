import type { CustomElementConstructor } from "typed-custom-elements"

/** Mixin to provide a shared state to a series of toggle buttons. */
export const ToggleGroupMixin = <T extends CustomElementConstructor>(Element: T): T & ToggleGroupMixin.Constructor => class ToggleGroupElement extends Element {}

export namespace ToggleGroupMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}
}
