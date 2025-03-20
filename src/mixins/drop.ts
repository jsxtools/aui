import type { CustomElementConstructor } from "../api/dom.ts"

import { InternalsMixin } from "./internals.ts"

/** A mixin to provide drop support to a custom element. */
export const DropMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends InternalsMixin(Element) {
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

		connectedCallback(): void {
			this.addEventListener("dragover", this.#handleDragOver, true)
			this.addEventListener("dragenter", this.#handleDragEnter, true)
			this.addEventListener("dragleave", this.#handleDragLeave, true)
			this.addEventListener("drop", this.#handleDrop, true)

			super.connectedCallback?.()
		}

		disconnectedCallback(): void {
			this.removeEventListener("dragover", this.#handleDragOver, true)
			this.removeEventListener("dragenter", this.#handleDragEnter, true)
			this.removeEventListener("dragleave", this.#handleDragLeave, true)
			this.removeEventListener("drop", this.#handleDrop, true)

			super.disconnectedCallback?.()
		}
	} as T & DropMixin.Constructor

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
