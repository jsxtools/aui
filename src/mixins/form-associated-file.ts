import type { CustomElementConstructor } from "../ssr/element.ts"
import type { FilePickerAcceptType } from "../ssr/show-open-file-picker.ts"

import { DropMixin } from "./drop.ts"
import { FormAssociatedMixin } from "./form-associated.ts"

/** A mixin to provide form association and validation to a custom element. */
export const FormAssociatedFileMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends FormAssociatedMixin(DropMixin(Element)) {
		static observedAttributes = ["multiple", ...super.observedAttributes!]

		excludeAcceptAllOption = true
		invalid = false
		maxSize = Number.POSITIVE_INFINITY
		multiple = false

		types: FilePickerAcceptType[] = [
			{
				description: "All Files",
				accept: {
					"*/*": [],
				},
			},
		]

		#files: File[] = []

		get files(): File[] {
			return [...this.#files]
		}

		#validateType(file: File) {
			for (const type of this.types) {
				for (const contentType in type.accept) {
					if (contentType === "*/*") {
						return true
					}

					if (file.type === contentType) {
						return true
					}

					for (const fileExtension of type.accept[contentType]!) {
						if (file.name.toLowerCase().endsWith(fileExtension)) {
							return true
						}
					}
				}
			}

			return false
		}

		#handleInput(possibleFiles: File[]): void {
			const formData: FormData = new FormData()
			const files: File[] = []

			this.internals.setValidity({})

			for (const file of possibleFiles) {
				if (this.excludeAcceptAllOption && !this.#validateType(file)) {
					this.internals.setValidity(
						{
							typeMismatch: true,
						},
						"Please upload an accepted file type if you want to proceed.",
					)

					this.#setFormValue([], null)

					return
				}

				if (file.size > this.maxSize) {
					this.internals.setValidity(
						{
							rangeOverflow: true,
						},
						"Please upload an smaller file size if you want to proceed.",
					)

					this.#setFormValue([], null)

					return
				}

				files.push(file)

				formData.append(this.name, file)
			}

			this.#setFormValue(files, formData)
		}

		#setFormValue(files: File[], formData: FormData | null) {
			this.#files = files

			this.internals.setFormValue(formData)

			this.dispatchEvent(new Event("input", { bubbles: true }))
			this.dispatchEvent(new Event("change", { bubbles: true }))
		}

		#handleDrop(event: DragEvent) {
			event.preventDefault()

			try {
				const files: File[] = []

				for (const item of event.dataTransfer!.items) {
					const file = item.getAsFile()

					if (file) {
						files.push(file)
					}
				}

				this.#handleInput(files)
			} catch {}
		}

		#handleClick(event: MouseEvent) {
			event.preventDefault()

			showOpenFilePicker({
				excludeAcceptAllOption: this.excludeAcceptAllOption,
				multiple: this.multiple,
				types: this.types,
			})
				.then((fileHandles) => {
					const handledFiles: Promise<File>[] = []

					for (const fileHandle of fileHandles) {
						handledFiles.push(fileHandle.getFile())
					}

					return Promise.all(handledFiles)
				})
				.then((files) => {
					this.#handleInput(files)
				})
		}

		connectedCallback(): void {
			this.addEventListener("drop", this.#handleDrop, true)
			this.addEventListener("click", this.#handleClick, true)

			super.connectedCallback?.()
		}

		disconnectedCallback(): void {
			this.removeEventListener("drop", this.#handleDrop, true)
			this.removeEventListener("click", this.#handleClick, true)

			super.disconnectedCallback?.()
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "multiple") {
				this.multiple = newValue !== null
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	} as T & FormAssociatedFileMixin.Constructor

export namespace FormAssociatedFileMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin, DropMixin.Mixin {
		excludeAcceptAllOption: boolean
		files: File[]
		invalid: boolean
		maxSize: number
		multiple: boolean
		types: FilePickerAcceptType[]
	}
}
