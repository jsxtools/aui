import type { CustomElementConstructor } from "typed-custom-elements"

import { InternalsMixin } from "./internals-mixin.ts"

/** A mixin to provide drop support to a custom element. */
export const DropMixin = <T extends CustomElementConstructor>(Element: T): T & DropMixin.Constructor =>
	class DropElement extends InternalsMixin(Element) {
		#drags = 0

		#handleDragOver(event: DragEvent): void {
			event.preventDefault()
		}

		#handleDragEnter(event: DragEvent): void {
			if (++this.#drags === 1) {
				this.internals.states.add("active-drop")

				if (
					!this.dispatchEvent(
						new DragEvent(
							"dropenter",
							Object.defineProperties(event, {
								bubbles: {
									value: false,
								},
							}),
						),
					)
				) {
					event.preventDefault()
				}
			}
		}

		#handleDragLeave(event: DragEvent): void {
			if (--this.#drags === 0) {
				this.internals.states.delete("active-drop")

				if (
					!this.dispatchEvent(
						new DragEvent(
							"dropleave",
							Object.defineProperties(event, {
								bubbles: {
									value: false,
								},
							}),
						),
					)
				) {
					event.preventDefault()
				}
			}
		}

		#handleDrop(event: DragEvent): void {
			event.preventDefault()

			this.#drags = 1
			this.#handleDragLeave(event)
		}

		constructor(...args: any[]) {
			const host = super(...args)! as DropElement

			host.addEventListener("dragover", host.#handleDragOver, true)
			host.addEventListener("dragenter", host.#handleDragEnter, true)
			host.addEventListener("dragleave", host.#handleDragLeave, true)
			host.addEventListener("drop", host.#handleDrop, true)
		}
	}

export namespace DropMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {}
}

declare global {
	interface HTMLElementEventMap {
		dropenter: DragEvent
		dropleave: DragEvent
	}
}
