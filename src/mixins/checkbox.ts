import type { CustomElementConstructor } from "../types.ts"

import { setShadowOf } from "../api/shadow-root.ts"
import { FormAssociatedMixin } from "./form-associated.ts"

/** Mixin to provide an easily styleable form associated checkbox. */
export const FormAssociatedCheckboxMixin = <T extends CustomElementConstructor>(Element: T): T & FormAssociatedCheckboxMixin.Constructor =>
	class extends FormAssociatedMixin(Element) {
		static formAssociated = true

		static observedAttributes = ["checked", ...(super.observedAttributes ?? [])]

		shadowRoot = setShadowOf(this, {
			adoptedStyleSheets: [DEFAULT_STYLE],
			delegatesFocus: true,
			innerHTML: `<button aria-labelledby="content"><slot name="indicator" part="indicator" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M12 5.7L6.7 11 4 8.1l.8-.7 2 2.1L11.2 5l.7.7z"/></svg></button><slot id="content">`,
			mode: "open",
		})

		constructor() {
			const host = super() as unknown as InstanceType<T & FormAssociatedCheckboxMixin.Constructor>

			host.internals.role = "checkbox"

			this.#updateState()

			host.addEventListener("click", () => {
				host.checked = !host.checked
			})
		}

		/** Current checkedness of the control. */
		get checked() {
			return this.#checked
		}

		set checked(value) {
			this.#checked = Boolean(value)

			this.#updateState()
		}

		/** Current value of the control. */
		get value() {
			return this.#value ?? this.getAttribute("value") ?? "on"
		}

		set value(value) {
			this.#value = String(value)

			this.#updateState()
		}

		/** Dirty internal checkedness of the control. */
		#checked = false

		/** Dirty internal value of the control. */
		#value = null as string | null

		#updateState() {
			this.internals.ariaChecked = String(this.#checked)

			this.internals.states[this.#checked ? "add" : "delete"]("checked")

			this.internals.setFormValue(this.#checked ? this.value : null)

			this.internals.setValidity(this.required && !this.#checked ? { valueMissing: true } : {}, "Please check this box if you want to proceed.")
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "checked") {
				this.#checked = newValue !== null

				this.#updateState()
			} else if (name === "value") {
				this.#updateState()
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}

		formAssociatedCallback(): void {
			this.#updateState()
		}

		formResetCallback(): void {
			this.#checked = this.hasAttribute("checked")
			this.#value = null

			this.#updateState()
		}
	}

const DEFAULT_STYLE = new CSSStyleSheet()

DEFAULT_STYLE.replaceSync(
	`:host{cursor:default;user-select:none}button{background:unset;border:unset;color:unset;padding:unset;display:inline-flex}svg{fill:currentcolor;width:1em;height:1em}`,
)

export namespace FormAssociatedCheckboxMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin {
		checked: boolean
	}
}
