import type { CustomElementConstructor } from "../ssr/element.ts"

import { mixinClick } from "./click.ts"
import { mixinInternals } from "./internals.ts"

export const mixinFormAssociated = <T extends CustomElementConstructor>(Element: T) =>
	class extends mixinClick(mixinInternals(Element)) {
		static formAssociated = true
		static observedAttributes = ["disabled", "required", "value", ...(super.observedAttributes || [])]

		// @ts-expect-error because it requires no initializer
		#disabled: boolean

		// @ts-expect-error because it requires no initializer
		#required: boolean

		// @ts-expect-error because it requires no initializer
		#value: string | File | FormData

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

		set name(value) {
			this.setAttribute("name", String(value))
		}

		get name(): string {
			return this.getAttribute("name") ?? ""
		}

		get value(): string | File | FormData {
			return this.#value ?? this.getAttribute("value") ?? ""
		}

		set value(value: string | File | FormData) {
			this.internals.setFormValue((this.#value = value))
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

		setCustomValidity(message: string) {
			const customError = Boolean(message)

			this.internals.setValidity({ customError }, message)
		}

		checkValidity(): boolean {
			return this.validity.valid
		}

		reportValidity(): boolean {
			return this.internals.reportValidity()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "disabled") {
				this.disabled = Boolean(newValue)
			} else if (name === "required") {
				this.required = Boolean(newValue)
			} else if (name === "value") {
				this.value = newValue ?? ""
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	} as unknown as T & mixinFormAssociated.Constructor

export namespace mixinFormAssociated {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends mixinInternals.Mixin, mixinInternals.Mixin {
		disabled: boolean
		form: HTMLFormElement | null
		internals: ElementInternals
		name: string
		required: boolean
		validationMessage: string
		validity: ValidityState
		value: string | File | FormData
		willValidate: boolean

		checkValidity(): boolean
		reportValidity(): boolean
	}
}
