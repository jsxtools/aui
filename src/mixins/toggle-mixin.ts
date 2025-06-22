import type { CustomElementConstructor } from "typed-custom-elements"

import { css } from "../api/css.ts"
import { supportKeyboardClick } from "../api/support-keyboard-click.ts"

/** Mixin to provide a two-state button that can be on or off. */
export const ToggleMixin = <T extends CustomElementConstructor>(Element: T): T & ToggleMixin.Constructor =>
	class ToggleElement extends Element {
		shadowRoot: ShadowRoot = Object.assign(
			this.attachShadow({
				mode: "open",
			}),
			{
				innerHTML: `<slot>`,
				adoptedStyleSheets: [
					css(`:host{display:inline-flex}button{display:inherit;appearance:unset;background-color:unset;border-width:0;color:unset;font:unset;margin:0;padding:0;}`),
				],
			},
		)

		internals: ElementInternals = Object.assign(this.attachInternals(), {
			role: "button",
			ariaPressed: "false",
		})

		#selected = false

		get selected(): boolean {
			return this.#selected
		}

		set selected(value: boolean) {
			this.#update((this.#selected = Boolean(value)))
		}

		#update(pressed: boolean) {
			this.internals.ariaPressed = String(pressed)
			this.internals.states[pressed ? "add" : "delete"]("pressed")
		}

		constructor(...args: any[]) {
			super(...args)

			supportKeyboardClick(this)

			requestAnimationFrame(() => {
				this.tabIndex = this.tabIndex === -1 ? 0 : this.tabIndex
			})

			this.addEventListener("click", () => {
				if (this.dispatchEvent(new Event("beforeselect", { bubbles: true, cancelable: true }))) {
					this.#update((this.#selected = !this.#selected))

					this.dispatchEvent(new Event("select"))
				}
			})
		}
	}

export namespace ToggleMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		shadowRoot: ShadowRoot
	}
}
