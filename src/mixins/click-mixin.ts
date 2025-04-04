import type { CustomElementConstructor } from "typed-custom-elements"

/** A mixin to provide keyboard-accessible click support to a custom element. */
export const ClickMixin = <T extends CustomElementConstructor>(Element: T): T & ClickMixin.Constructor =>
	class ClickElement extends Element {
		#handleKeydown(event: KeyboardEvent): void {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault()
			}

			if (event.key === "Enter") {
				// @ts-expect-error because its an element
				event.currentTarget!.click()
			}
		}

		#handleKeyup(event: KeyboardEvent): void {
			if (event.key === " " && !event.altKey) {
				// @ts-expect-error because its an element
				event.currentTarget!.click()
			}
		}

		constructor(...args: any[]) {
			const host = super(...args)! as ClickElement

			host.addEventListener("keydown", host.#handleKeydown, true)
			host.addEventListener("keyup", host.#handleKeyup, true)
		}
	}

export namespace ClickMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}
}
