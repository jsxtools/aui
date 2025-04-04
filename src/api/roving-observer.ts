export class RovingTab {
	#callback: RovingTabCallback
	#elements: Set<HTMLElement> = new Set()
	#selected: HTMLElement | null = null

	constructor(callback: RovingTabCallback) {
		this.#callback = callback
	}

	observe(element: HTMLElement) {
		if (this.#elements.size < this.#elements.add(element).size) {
			element.addEventListener("keydown", this.#handleKeyDown)

			if (~element.tabIndex && !this.#selected) {
				this.#selected = element
			}
		}
	}

	unobserve(element: HTMLElement) {
		if (this.#elements.delete(element)) {
			element.removeEventListener("keydown", this.#handleKeyDown)

			if (this.#selected === element) {
				this.#selected = null
			}
		}
	}

	disconnect() {
		for (const element of this.#elements) {
			this.unobserve(element)
		}
	}

	#handleKeyDown = (event: KeyboardEvent) => {
		const oldSelected = this.#selected
		const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0

		if (delta) {
			const orderedElements = [...this.#elements].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1))
			const oldSelectedIndex = Math.max(0, orderedElements.indexOf(oldSelected!))
			const newSelectedIndex = (oldSelectedIndex + delta + orderedElements.length) % orderedElements.length
			const newSelected = orderedElements[newSelectedIndex]

			event.preventDefault()

			if (newSelected === oldSelected) {
				return
			}

			if (oldSelected) {
				oldSelected.tabIndex = -1
			}

			if (newSelected) {
				newSelected.tabIndex = 0

				this.#selected = newSelected

				newSelected.focus()

				this.#callback(newSelected)
			}
		}
	}
}

export type RovingTabCallback = (element: HTMLElement) => void
