import type { CustomElementConstructor } from "../api/dom.ts"

import { InternalsMixin } from "./internals.ts"

/** A mixin to provide drag support to a custom element. */
export const DragMixin = <T extends CustomElementConstructor>(Element: T) =>
	class Draggable extends InternalsMixin(Element) {
		static observedAttributes = ["draggable", ...(super.observedAttributes || [])]

		get draggable() {
			return true
		}

		#handleDragStart(event: DragEvent): void {
			Object(event.dataTransfer).effectAllowed = "move"

			this.internals.states.add("active-drag")
		}

		#handleDragEnd(): void {
			this.internals.states.delete("active-drag")
		}

		connectedCallback() {
			super.draggable = true

			super.addEventListener("dragstart", this.#handleDragStart)
			super.addEventListener("dragend", this.#handleDragEnd)

			super.connectedCallback?.()
		}

		disconnectedCallback() {
			super.removeEventListener("dragstart", this.#handleDragStart)
			super.removeEventListener("dragend", this.#handleDragEnd)

			super.disconnectedCallback?.()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
			if (name === "draggable" && newValue === null) {
				super.draggable = true
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	}

export namespace DragMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {}
}
