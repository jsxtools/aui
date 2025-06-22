import type { CustomElementConstructor } from "typed-custom-elements"

/** Mixin to provide a shared state to a series of toggle buttons. */
export const ToggleGroupMixin = <T extends CustomElementConstructor>(Element: T): T & ToggleGroupMixin.Constructor =>
	class ToggleGroupElement extends Element {
		constructor(...args: any[]) {
			super(...args)

			this.addEventListener("keydown", (event: KeyboardEvent) => {
				const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0

				if (delta) {
					const selectedElement = (this.getRootNode() as Document | ShadowRoot).activeElement as ToggleGroupMixin.SelectableElement
					const selectableElements = this.#getSelectableElements()
					const newSelectedIndex = (selectableElements.indexOf(selectedElement) + delta + selectableElements.length) % selectableElements.length
					const newSelectedElement = selectableElements[newSelectedIndex]!

					if (selectedElement) {
						selectedElement.tabIndex = -1
					}

					if (newSelectedElement) {
						newSelectedElement.tabIndex = 0

						newSelectedElement.focus()
					}
				}
			})

			this.addEventListener("beforeselect", (event) => {
				for (const selectableElement of this.#getSelectableElements()) {
					if (selectableElement.contains(event.target as Node)) {
						if (selectableElement.selected) {
							event.preventDefault()
							event.stopImmediatePropagation()
						}
					} else {
						selectableElement.selected = false
					}
				}
			})
		}

		#getSelectableElements = (): ToggleGroupMixin.SelectableElement[] => {
			const iterator = this.ownerDocument.createNodeIterator(this, NodeFilter.SHOW_ELEMENT, {
				acceptNode(node) {
					return "selected" in node ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
				},
			})

			const results: ToggleGroupMixin.SelectableElement[] = []

			let node: Node | null

			while ((node = iterator.nextNode())) {
				results.push(node as ToggleGroupMixin.SelectableElement)
			}

			return results
		}
	}

export namespace ToggleGroupMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}

	export interface SelectableElement extends HTMLElement {
		selected: boolean
	}
}
