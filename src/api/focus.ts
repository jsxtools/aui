/** Inerts all non-inert sibling elements outside the target’s hierarchy, returning the inerted elements. */
export const limitFocusWithin = (target: Element) => {
	const inerted = new Set<Element>()

	while (target) {
		const parent: Element | null = target.parentElement

		if (parent) {
			for (const sibling of parent.children as HTMLCollectionOf<HTMLElement>) {
				if (sibling !== target && sibling.inert === false) {
					sibling.inert = true

					inerted.add(sibling)
				}
			}
		}

		target = parent!
	}

	return inerted
}
