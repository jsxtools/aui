import type { CustomElementConstructor } from "../api/dom.ts"

import { ClickMixin } from "./click.ts"
import { InternalsMixin } from "./internals.ts"

/** A mixin to provide form association and validation support to a custom element. */
export const FormAssociatedMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends ClickMixin(InternalsMixin(Element)) {
		static formAssociated = true
		static observedAttributes = ["disabled", "required", ...(super.observedAttributes || [])]

		#disabled: boolean | undefined
		#required: boolean | undefined

		get disabled(): boolean {
			return this.#disabled ?? this.hasAttribute("disabled")
		}

		set disabled(flag) {
			this.internals.ariaDisabled = String((this.#disabled = Boolean(flag)))
		}

		get required(): boolean {
			return this.#required ?? this.hasAttribute("required")
		}

		set required(flag) {
			this.internals.ariaRequired = String((this.#required = Boolean(flag)))
		}

		set name(name) {
			this.setAttribute("name", name)
		}

		get name(): string {
			return this.getAttribute("name") ?? ""
		}

		get defaultValue(): string {
			return this.getAttribute("value") ?? ""
		}

		set defaultValue(value) {
			this.setAttribute("value", value)
		}

		get form(): HTMLFormElement | null {
			return this.internals.form
		}

		get validity(): ValidityState {
			return this.internals.validity
		}

		get validationMessage(): string {
			return this.internals.validationMessage
		}

		get willValidate(): boolean {
			return this.internals.willValidate
		}

		checkValidity(): boolean {
			return this.validity.valid
		}

		setCustomValidity(message: string): void {
			const customError = Boolean(message)

			this.internals.setValidity({ customError }, message)
		}

		reportValidity(): boolean {
			return this.internals.reportValidity()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "disabled") {
				this.disabled = newValue !== null
			} else if (name === "required") {
				this.required = newValue !== null
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	} as T & FormAssociatedMixin.Constructor

export namespace FormAssociatedMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends InternalsMixin.Mixin {
		defaultValue: string
		disabled: boolean
		form: HTMLFormElement | null
		name: string
		required: boolean
		validationMessage: string
		validity: ValidityState
		willValidate: boolean

		checkValidity(): boolean
		setCustomValidity(message: string): void
		reportValidity(): boolean
	}
}
