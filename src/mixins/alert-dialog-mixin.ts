import type { CustomElementConstructor } from "typed-custom-elements"

import { limitFocusWithin } from "../api/focus.ts"

export const AlertDialogMixin = <T extends CustomElementConstructor>(Element: T): T & AlertDialogMixin.Constructor =>
	class AlertDialogElement extends Element {
		#focus: HTMLElement | undefined

		#inerted: Set<Element> | undefined

		shadowRoot: ShadowRoot = Object.assign(this.attachShadow({ mode: "open" }), {
			innerHTML: "<slot name=label part=label></slot><slot name=description part=description></slot><slot>",
		})

		internals: ElementInternals = Object.assign(this.attachInternals(), {
			role: "alertdialog",
			ariaModal: "true",
			ariaLabelledByElements: [this.shadowRoot.querySelector("[name='label']")!],
			ariaDescribedByElements: [this.shadowRoot.querySelector("[name='description']")!],
		})

		constructor(...args: any[]) {
			const host = super(...args)! as AlertDialogElement

			host.addEventListener(
				"command",
				(event) => {
					if (event.command === "toggle-popover") {
						host.#focus = event.source as HTMLButtonElement
					}
				},
				true,
			)

			host.addEventListener(
				"toggle",
				(event) => {
					if ((event as ToggleEvent).newState === "open") {
						host.#inerted = limitFocusWithin(host)

						host.querySelector("button")?.focus()
					} else if (host.#inerted) {
						for (const element of host.#inerted as Set<HTMLElement>) {
							element.inert = false
						}

						host.#inerted.clear()

						host.#focus?.focus()
					}
				},
				true,
			)
		}
	}

export namespace AlertDialogMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		internals: ElementInternals
		shadowRoot: ShadowRoot
	}
}
