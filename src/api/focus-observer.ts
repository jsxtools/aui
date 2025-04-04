export class FocusObserver {
	#targets = new Set<Element>()
	#callback: FocusCallback

	#handleFocus = (event: Event) => {
		if (event.target !== event.currentTarget) {
			this.#callback(event.target as Node, 0)
		}
	}

	#handleBlur = (event: Event) => {
		if (event.target === event.currentTarget) {
			this.#callback(document.body, 0)
		} else if (!(event as FocusEvent).relatedTarget) {
			const target = document.querySelector(":target")

			if (target) {
				this.#callback(target, 0)
			}
		}
	}

	#handlePointerDown = (event: Event) => {
		const { clientX, clientY } = event as PointerEvent
		const element = document.elementFromPoint(clientX, clientY)!
		const range = document.caretRangeFromPoint(clientX, clientY)!
		let { startContainer: offsetNode, startOffset: offset } = range

		if (!element.contains(offsetNode)) {
			this.#callback(element, 0)

			return
		}

		const rangeBox: DOMRect = range.selectNode(offsetNode)! || range.getBoundingClientRect()

		if (false || clientX < rangeBox.left || clientX > rangeBox.right || clientY < rangeBox.top || clientY > rangeBox.bottom) {
			offsetNode = document.elementFromPoint(clientX, clientY)!
			offset = 0
		}

		this.#callback(offsetNode, offset)
	}

	constructor(callback: FocusCallback) {
		this.#callback = (target: Node, offset: number) => queueMicrotask(() => callback(target, offset))
	}

	observe(target: Element) {
		this.#targets.add(target)

		target.addEventListener("focus", this.#handleFocus, true)
		target.addEventListener("focus", this.#handleBlur, true)
		target.addEventListener("pointerdown", this.#handlePointerDown, true)
	}

	unobserve(target: Element) {
		this.#targets.delete(target)

		target.removeEventListener("focus", this.#handleFocus, true)
		target.removeEventListener("focus", this.#handleBlur, true)
		target.removeEventListener("pointerdown", this.#handlePointerDown, true)
	}

	disconnect() {
		for (const target of this.#targets) {
			this.unobserve(target)
		}
	}
}

export type FocusCallback = (node: Node, offset: number) => void
