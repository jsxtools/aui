const handleClick = (event: KeyboardEvent) => {
	const { target } = event as any as { target: HTMLSpanElement }

	switch (event.key) {
		// @ts-ignore fallthrough is desired
		case event.type === "keydown" && "Enter":
			target.click()

		case " ":
			event.preventDefault()

			if (!event.altKey && event.type === "keyup") {
				target.click()
			}
	}
}

export const supportKeyboardClick = (element: HTMLElement) => (element.addEventListener("keydown", handleClick), element.addEventListener("keyup", handleClick))
