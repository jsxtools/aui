import type { CustomElementConstructor } from "../api/dom.ts"
import type { FilePickerAcceptType } from "../api/show-open-file-picker.ts"

import { type FileException, FileMixin } from "./file.ts"
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

			for (const item of this.items) {
				if (item instanceof File) {
					data.append(this.name, item)

					hasSuccess = true
				}
			}

			if (hasSuccess === false && this.items.length > 0) {
				this.internals.setValidity(
					{
						[(this.items[0] as FileException).name === "RangeError" ? "rangeOverflow" : "typeMismatch"]: true,
					},
					(this.items[0] as FileException).message,
				)
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
