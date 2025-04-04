import type { CustomElementConstructor } from "../types.ts"

import { ChildrenChangedMixin } from "./children-changed.ts"

/** Mixin to provide collapsible sections by headings. */
export const AccordionMixin = <T extends CustomElementConstructor>(Element: T): T & AccordionMixin.Constructor =>
	class extends ChildrenChangedMixin(Element) {
		shadowRoot = this.attachShadow({
			mode: "open",
			slotAssignment: "manual",
		})

		childrenChangedCallback(addedNodes: Node[], removedNodes: Node[]): void {
			super.childrenChangedCallback?.(addedNodes, removedNodes)

			const disclosures = __ACCORDION_INTERNALS.set(this, []).get(this)!

			for (const node of this.childNodes) {
				if (node instanceof HTMLHeadingElement) {
					const disclosure = new AccordionDisclosure()

					const group = this.shadowRoot.appendChild(__CREATE_ELEMENT("div", { part: "disclosure closed" }))
					const title = group.appendChild(__CREATE_ELEMENT("slot", {
						part: "title closed",
						onclick() {
							disclosure.open = !disclosure.open
						},
					}))
					const panel = group.appendChild(__CREATE_ELEMENT("slot", { part: "panel closed" }))

					title.assign(node)

					__ACCORDION_DISCLOSURES.set(disclosure, {
						open: false,
						group,
						title,
						panel,
					})

					disclosures.push(disclosure)
				} else if (node instanceof Element || node instanceof Text) {
					const panel = __ACCORDION_DISCLOSURES.get(disclosures.at(-1)!)?.panel

					if (panel) {
						panel.assign(...panel.assignedNodes() as (Element | Text)[], node)
					}
				}
			}
		}

		get disclosures() {
			return [ ...(__ACCORDION_INTERNALS.get(this) || []) ]
		}
	}

const __ACCORDION_INTERNALS = new WeakMap<InstanceType<AccordionMixin.Constructor>, any>()

const __ACCORDION_DISCLOSURES = new WeakMap<AccordionDisclosure, {
	open: boolean
	group: HTMLDivElement
	title: HTMLSlotElement
	panel: HTMLSlotElement
}>()

export class AccordionDisclosure {
	get title(): HTMLElement {
		return __ACCORDION_DISCLOSURES.get(this)!.title.assignedElements()[0] as HTMLElement
	}

	get panel(): Node[] {
		return __ACCORDION_DISCLOSURES.get(this)!.panel.assignedNodes()
	}

	get open(): boolean {
		return __ACCORDION_DISCLOSURES.get(this)!.open
	}

	set open(value: boolean) {
		value = Boolean(value)

		const internals = __ACCORDION_DISCLOSURES.get(this)!

		if (internals.open !== value) {
			internals.open = value

			internals.group.part.toggle("open", value)
			internals.group.part.toggle("closed", !value)

			internals.panel.part.toggle("open", value)
			internals.panel.part.toggle("closed", !value)

			internals.title.part.toggle("open", value)
			internals.title.part.toggle("closed", !value)
		}
	}
}

export namespace AccordionMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}
}

const __CREATE_ELEMENT = <T extends keyof HTMLElementTagNameMap>(
	name: T,
	props:
		& {
			[K in `on${keyof HTMLElementEventMap}`]?: K extends `on${infer EventName extends keyof HTMLElementEventMap}`
				? (this: HTMLElementTagNameMap[T], event: HTMLElementEventMap[EventName]) => void
				: never
		}
		& {
			[K in keyof HTMLElementTagNameMap[T]]?: unknown
		}
): HTMLElementTagNameMap[T] =>
	Object.assign(document.createElement(name), props);
