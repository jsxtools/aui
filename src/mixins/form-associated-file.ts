import type { CustomElementConstructor } from "../api/dom.ts"
import type { FilePickerAcceptType } from "../api/show-open-file-picker.ts"

import { FileMixin } from "./file.ts"
import { FormAssociatedMixin } from "./form-associated.ts"

/** A mixin to provide form association and validation to a custom element. */
export const FormAssociatedFileMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends FormAssociatedMixin(FileMixin(Element)) {
		types: FilePickerAcceptType[] = [
			{
				description: "All Files",
				accept: {
					"*/*": [],
				},
			},
		]

		#handleInput(): void {
			const data = new FormData()

			let hasSuccess = false

			for (const file of this.files) {
				if (file.validity.valid) {
					data.append(this.name, file)

					hasSuccess = true
				}
			}

			if (hasSuccess === false && this.files.length > 0) {
				this.internals.setValidity(this.files[0]!.validity, this.files[0]!.validityMessage)
			} else {
				this.internals.setValidity({})
			}

			this.internals.setFormValue(data)

			this.dispatchEvent(new Event("change", { bubbles: true }))
		}

		connectedCallback(): void {
			this.addEventListener("input", this.#handleInput, true)

			super.connectedCallback?.()
		}

		disconnectedCallback(): void {
			this.removeEventListener("drop", this.#handleInput, true)

			super.disconnectedCallback?.()
		}
	} as T & FormAssociatedFileMixin.Constructor

export namespace FormAssociatedFileMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin, FileMixin.Mixin {}
}
