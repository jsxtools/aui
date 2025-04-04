import type { CustomElementConstructor } from "../types.ts"

/** A mixin to provide a configurable ShadowRoot to a custom element. */
export const ShadowMixin = <T extends CustomElementConstructor>(Element: T): T & ShadowMixin.Constructor =>
	class extends Element {
		static shadowRootMode: ShadowRootMode = "open"
		static shadowRootDelegatesFocus = false
		static shadowRootSerializable = false
		static shadowRootSlotAssignment: SlotAssignmentMode = "named"
		static shadowRootInnerHTML: string | null = "<slot>"
		static shadowRootAdoptedStyleSheets: CSSStyleSheet[] = []

		shadowRoot: ShadowRoot = Object.assign(
			this.attachShadow({
				mode: (this.constructor as ShadowMixin.Constructor).shadowRootMode,
				delegatesFocus: (this.constructor as ShadowMixin.Constructor).shadowRootDelegatesFocus,
				slotAssignment: (this.constructor as ShadowMixin.Constructor).shadowRootSlotAssignment,
				serializable: (this.constructor as ShadowMixin.Constructor).shadowRootSerializable,
			}),
			{
				innerHTML: (this.constructor as ShadowMixin.Constructor).shadowRootInnerHTML,
				adoptedStyleSheets: (this.constructor as ShadowMixin.Constructor).shadowRootAdoptedStyleSheets,
			},
		)
	}

export namespace ShadowMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {
		shadowRootMode: ShadowRootMode
		shadowRootDelegatesFocus: boolean
		shadowRootSerializable: boolean
		shadowRootSlotAssignment: SlotAssignmentMode
		shadowRootInnerHTML: string | null
		shadowRootAdoptedStyleSheets: CSSStyleSheet[]
	}

	export interface Mixin extends HTMLElement {
		shadowRoot: ShadowRoot
	}
}
