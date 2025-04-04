import type { FilePickerAcceptType } from "show-open-file-picker/types"
import type { CustomElementConstructor } from "typed-custom-elements"

import { FileMixin } from "./file-mixin.ts"
import { FormAssociatedMixin } from "./form-associated-mixin.ts"

/** A mixin to provide form association and validation to a custom element. */
export const FormAssociatedFileMixin = <T extends CustomElementConstructor>(Element: T): T & FormAssociatedFileMixin.Constructor =>
	class FormAssociatedFileElement extends FormAssociatedMixin(FileMixin(Element)) {
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

		constructor(...args: any[]) {
			const host = super(...args)! as FormAssociatedFileElement

			host.addEventListener("input", host.#handleInput, true)
		}
	}

export namespace FormAssociatedFileMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin, FileMixin.Mixin {}
}
