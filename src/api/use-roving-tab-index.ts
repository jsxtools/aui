export const useRovingTabIndex = (callback: (selectedElement: HTMLElement) => void, ...elements: HTMLElement[]): (() => void) => {
	let selectedIndex = Math.max(
		0,
		elements.findIndex((element) => ~element.tabIndex),
	)
	let selectedElement = elements[selectedIndex]!

	// Initialize: only first element gets tabIndex = 0
	elements.forEach((el, i) => {
		el.tabIndex = i === selectedIndex ? 0 : -1
	})

	// Focus handler
	const focusElement = () => {
		selectedElement.tabIndex = -1
		selectedElement = elements[selectedIndex]!
		selectedElement.tabIndex = 0

		selectedElement.focus()

		callback(selectedElement)
	}

	// Keyboard navigation
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				selectedIndex = (selectedIndex + 1) % elements.length
				break
			case "ArrowLeft":
			case "ArrowUp":
				selectedIndex = (selectedIndex - 1 + elements.length) % elements.length
				break
			default:
				return
		}

		event.preventDefault()

		focusElement()
	}

	// Attach keydown listeners
	for (const element of elements) {
		element.addEventListener("keydown", handleKeyDown)
	}

	return () => {
		for (const element of elements) {
			element.removeEventListener("keydown", handleKeyDown)
		}
	}
}
