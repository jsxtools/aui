import type { CustomElementConstructor } from "../api/dom.ts"
import type { FilePickerAcceptType } from "../api/show-open-file-picker.ts"

import { DropMixin } from "./drop.ts"

/** A mixin to provide file drop and file picker support to a custom element. */
export const FileMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends DropMixin(Element) {
		static observedAttributes = ["multiple", ...(super.observedAttributes || [])]

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

		#items: FileMixin.Mixin["items"] = []

		get items(): FileMixin.Mixin["items"] {
			return [...this.#items]
		}

		#isValidFile(file: File): boolean {
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

		#handleFiles(settledFiles: File[]): void {
			this.#items = []

			for (const file of settledFiles) {
				this.#items.push(
					file.size > this.maxSize
						? new FileException("Unsupported file size", "RangeError", file)
						: !this.#isValidFile(file)
							? new FileException("Unsupported file type", "TypeError", file)
							: file,
				)
			}

			this.dispatchEvent(new Event("input", { bubbles: true }))
		}

		#handleDrop(event: DragEvent): void {
			event.preventDefault()

			try {
				const files: File[] = []

				for (const item of event.dataTransfer!.items) {
					const file = item.getAsFile()

					if (file) {
						files.push(file)
					}
				}

				this.#handleFiles(files)
			} catch {}
		}

		#handleClick(event: MouseEvent): void {
			event.preventDefault()

			showOpenFilePicker({
				excludeAcceptAllOption: true,
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
					this.#handleFiles(files)
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
	} as T & FileMixin.Constructor

export namespace FileMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends DropMixin.Mixin {
		items: (File | FileException)[]
		maxSize: number
		multiple: boolean
		types: FilePickerAcceptType[]
	}
}

export class FileException extends DOMException {
	declare name: "RangeError" | "TypeError"
	declare file: File | null

	constructor(message: string, name: "RangeError" | "TypeError", file = null as File | null) {
		Object.assign(super(message, name) as unknown as FileException, { file })
	}
}
