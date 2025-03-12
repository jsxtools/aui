import type { CustomElementConstructor } from "../ssr/element.ts"

import { InternalsMixin } from "./internals.ts"

/** A mixin to provide drag-and-drop support to a custom element. */
export const DropMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends InternalsMixin(Element) {
		#handleDragOver(event: DragEvent): void {
			event.preventDefault()
		}

		#handleDragEnter(): void {
			this.internals.states.add("active-drop")
		}

		#handleDragLeave(): void {
			this.internals.states.delete("active-drop")
		}

		connectedCallback(): void {
			this.addEventListener("dragover", this.#handleDragOver, true)
			this.addEventListener("dragenter", this.#handleDragEnter, true)
			this.addEventListener("dragleave", this.#handleDragLeave, true)
			this.addEventListener("drop", this.#handleDragLeave, true)

			super.connectedCallback?.()
		}

		disconnectedCallback(): void {
			this.removeEventListener("dragover", this.#handleDragOver, true)
			this.removeEventListener("dragenter", this.#handleDragEnter, true)
			this.removeEventListener("dragleave", this.#handleDragLeave, true)
			this.removeEventListener("drop", this.#handleDragLeave, true)

			super.disconnectedCallback?.()
		}
	} as T & DropMixin.Constructor

export namespace DropMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {}
}
