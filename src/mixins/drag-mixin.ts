import type { CustomElementConstructor } from "typed-custom-elements"

import { InternalsMixin } from "./internals-mixin.ts"

/** A mixin to provide drag support to a custom element. */
export const DragMixin = <T extends CustomElementConstructor>(Element: T): T & DragMixin.Constructor =>
	class DragElement extends InternalsMixin(Element) {
		#handleDragStart(event: DragEvent): void {
			Object(event.dataTransfer).effectAllowed = "move"

			this.internals.states.add("active-drag")
		}

		#handleDragEnd(): void {
			this.internals.states.delete("active-drag")
		}

		constructor(...args: any[]) {
			const host = super(...args)! as DragElement

			host.addEventListener("dragstart", host.#handleDragStart)
			host.addEventListener("dragend", host.#handleDragEnd)
		}
	}

export namespace DragMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {}
}
