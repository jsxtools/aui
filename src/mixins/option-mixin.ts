import type { CustomElementConstructor } from "typed-custom-elements"

import { addContextListener, removeContextListener } from "context-protocol/subscriptions"
import { css } from "../api/css.ts"
import { ClickMixin } from "./click-mixin.ts"
import { InternalsMixin } from "./internals-mixin.ts"

/** Mixin to provide an easily styleable option element. */
export const OptionMixin = <T extends CustomElementConstructor>(Element: T): T & OptionMixin.Constructor =>
	class OptionElement extends ClickMixin(InternalsMixin(Element)) {
		#providedValue = null as OptionMixin.ContextValue | null
		#selected = null as boolean | null
		#value = null as string | null

		#handleContext = (providedValue: unknown) => {
			this.#providedValue = providedValue as OptionMixin.ContextValue

			this.#updateState()
		}

		#handleClick = () => {
			this.selected = (this.#providedValue?.multiple ?? true) ? !this.selected : true
		}

		#updateState() {
			const providedValue = this.#providedValue

			if (!providedValue) return

			this.internals.role = providedValue.role
			this.internals.states.clear()
			this.internals.states.add(providedValue.role)
			this.internals.states[this.selected ? "add" : "delete"]("selected")

			this.internals.ariaChecked = this.internals.ariaSelected = String(this.selected)

			const path = this.shadowRoot!.firstChild!.firstChild! as HTMLElement

			path.setAttribute("d", providedValue.multiple ? SVG_CHECK : SVG_RADIO)

			providedValue.handleOption(this)
		}

		shadowRoot: ShadowRoot = Object.assign(
			this.attachShadow({
				mode: "open",
			}),
			{
				innerHTML: `<svg part="indicator" viewBox="0 0 16 16" aria-hidden="true"><path /></svg><slot part="label" tabindex="0">`,
				adoptedStyleSheets: [
					css(
						`:host{-webkit-user-select:none;user-select:none}`,
						`:host(:state(checkbox)){--corner:2px}`,
						`:host(:state(radio)){--corner:calc(infinity*1px);}`,
						`:host(:not(:state(selected))){--fill:color-mix(in srgb, CanvasText 0%, transparent)}`,
						`:host(:state(selected)){--fill:color-mix(in srgb, CanvasText 100%, transparent)}`,
						`svg{width:1em;box-shadow:CanvasText 0 0 0 1px inset;border-radius:var(--corner);fill:var(--fill)}`,
						`slot{display:inline-block}`,
					),
				],
			},
		)

		get selected(): boolean {
			return this.#selected ?? this.hasAttribute("selected")
		}

		set selected(flag: boolean) {
			this.#selected = Boolean(flag)

			this.#updateState()
		}

		get value(): string {
			return this.#value ?? this.textContent!
		}

		set value(value) {
			this.#value = String(value)

			this.#updateState()
		}

		constructor(...args: any[]) {
			const host = super(...args)! as OptionElement

			host.addEventListener("click", host.#handleClick)
		}

		connectedCallback() {
			addContextListener(this, "context:option", this.#handleContext, true)

			super.connectedCallback?.()
		}

		disconnectedCallback() {
			removeContextListener(this, "context:option", this.#handleContext)

			super.disconnectedCallback?.()
		}
	}

const SVG_CHECK = `M12 5.7L6.7 11 4 8.1l.8-.7 2 2.1L11.2 5l.7.7z`
const SVG_RADIO = `M8 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8z`

export namespace OptionMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {
		shadowRoot: ShadowRoot
		selected: boolean
		value: string
	}

	export type ContextValue = {
		multiple: boolean
		role: string

		handleOption: (selectedOption: HTMLElement & Mixin) => void
	}
}
