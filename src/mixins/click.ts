import type { CustomElementConstructor } from "../api/dom.ts"

/** A mixin to provide keyboard-accessible click support to a custom element. */
export const ClickMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends Element {
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

		connectedCallback(): void {
			this.addEventListener("keydown", this.#handleKeydown, true)
			this.addEventListener("keyup", this.#handleKeyup, true)

			super.connectedCallback?.()
		}

		disconnectedCallback(): void {
			this.removeEventListener("keydown", this.#handleKeydown, true)
			this.removeEventListener("keyup", this.#handleKeyup, true)

			super.disconnectedCallback?.()
		}
	} as T & ClickMixin.Constructor

export namespace ClickMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}
}
