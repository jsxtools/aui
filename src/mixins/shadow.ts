import type { CustomElementConstructor } from "../api/dom.ts"

/** A mixin to provide a configurable ShadowRoot to a custom element. */
export const ShadowMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends Element {
		static shadowRootMode = "open" as ShadowRootMode
		static shadowRootDelegatesFocus = false as boolean
		static shadowRootSerializable = false as boolean
		static shadowRootSlotAssignment = "named" as SlotAssignmentMode
		static shadowRootInnerHTML = "<slot>" as string | null
		static shadowRootAdoptedStyleSheets = [] as CSSStyleSheet[]

		shadowRoot = Object.assign(
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
		) as ShadowRoot
	} as T & ShadowMixin.Constructor

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
