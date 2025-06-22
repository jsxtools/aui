declare global {
	interface ARIAMixin {
		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaActiveDescendantElement) */
		ariaActiveDescendantElement: Element

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaControlsElements) */
		ariaControlsElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaDescribedByElements) */
		ariaDescribedByElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaDetailsElements) */
		ariaDetailsElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaErrorMessageElements) */
		ariaErrorMessageElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaFlowToElements) */
		ariaFlowToElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaLabelledByElements) */
		ariaLabelledByElements: Element[]

		/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#:~:text=ariaOwnsElements) */
		ariaOwnsElements: Element[]
	}
}

export type {}
