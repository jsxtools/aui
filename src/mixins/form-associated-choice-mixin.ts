import type { CustomElementConstructor } from "typed-custom-elements"
import type { OptionMixin } from "./option-mixin.ts"

import { setContextValue } from "context-protocol/subscriptions"
import { FormAssociatedMixin } from "./form-associated-mixin.ts"

/** Mixin to provide an easily styleable form associated choice. */
export const FormAssociatedChoiceMixin = <T extends CustomElementConstructor>(Element: T): T & FormAssociatedChoiceMixin.Constructor =>
	class FormAssociatedChoiceElement extends FormAssociatedMixin(Element) {
		static observedAttributes = ["multiple", ...(super.observedAttributes || [])]

		#options = new Set<HTMLElement & OptionMixin.Mixin>()
		#multiple = null as boolean | null
		#value = new Set<string>()

		#updateFormValue() {
			const formData = new FormData()

			let hasSingleOption = false

			for (const option of this.#options) {
				if (option.selected && (this.multiple || !hasSingleOption)) {
					hasSingleOption = true

					formData.append(this.name, option.value)
				}
			}

			this.internals.setFormValue(formData)
		}

		#provideContext() {
			this.internals.role = this.multiple ? "group" : "radiogroup"

			setContextValue(this, "context:option", {
				multiple: this.multiple,
				role: this.multiple ? "checkbox" : "radio",
				handleOption: (selectedOption) => {
					this.#options.add(selectedOption)

					if (!this.multiple && selectedOption.selected) {
						for (const option of this.#options) {
							if (option !== selectedOption) {
								option.selected = false
							}
						}
					}

					this.#updateFormValue()
				},
			} as OptionMixin.ContextValue)

			this.#updateFormValue()
		}

		get multiple(): boolean {
			return this.#multiple ?? this.hasAttribute("multiple")
		}

		set multiple(flag: boolean) {
			this.#multiple = Boolean(flag)

			this.#provideContext()
		}

		get value(): string[] {
			return [...this.#value]
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "multiple") {
				this.#provideContext()
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}

		connectedCallback() {
			this.#provideContext()

			super.connectedCallback?.()
		}
	}

export namespace FormAssociatedChoiceMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin {
		multiple: boolean
		value: string[]
	}
}
