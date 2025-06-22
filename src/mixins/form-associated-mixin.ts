import type { CustomElementConstructor } from "typed-custom-elements"

import { InternalsMixin } from "./internals-mixin.ts"

/** A mixin to provide form association and validation support to a custom element. */
export const FormAssociatedMixin = <T extends CustomElementConstructor>(Element: T): T & FormAssociatedMixin.Constructor =>
	class FormAssociatedElement extends InternalsMixin(Element) {
		static formAssociated = true
		static observedAttributes = ["disabled", "required", "value", ...(super.observedAttributes || [])]

		get disabled(): boolean {
			return this.hasAttribute("disabled")
		}

		set disabled(flag: boolean) {
			this.toggleAttribute("disabled", flag)
		}

		get required(): boolean {
			return this.hasAttribute("required")
		}

		set required(flag: boolean) {
			this.toggleAttribute("required", flag)
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
				this.internals.ariaDisabled = String(newValue !== null)
			} else if (name === "required") {
				this.internals.ariaRequired = String(newValue !== null)
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	}

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
