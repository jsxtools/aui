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

		#files: FileMixin.Mixin["files"] = []

		get files(): FileMixin.Mixin["files"] {
			return [...this.#files]
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
			this.#files = []

			for (const file of settledFiles) {
				this.#files.push(
					file.size > this.maxSize
						? new TransferFile(file, { valid: false, rangeOverflow: true }, "Unsupported file size")
						: !this.#isValidFile(file)
							? new TransferFile(file, { valid: false, typeMismatch: true }, "Unsupported file type")
							: new TransferFile(file),
				)
			}

			this.dispatchEvent(new Event("input", { bubbles: true }))
		}

		#handleDrop(event: DragEvent): void {
			event.preventDefault()

			const files: File[] = []

			for (const file of event.dataTransfer!.files) {
				files.push(file)
			}

			this.#handleFiles(files)
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
				.then(
					(files) => {
						this.#handleFiles(files)
					},
					() => {
						// if the show file picker is aborted, blocked, or fails (`AbortError`, `SecurityError`, `TypeError`); or,
						// if a picked file unexpectedly changes or is removed (`NotAllowedError`, `NotFoundError`); then,
						// such errors are silently ignored
					},
				)
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
		files: TransferFile[]
		maxSize: number
		multiple: boolean
		types: FilePickerAcceptType[]
	}
}

export class TransferFile extends File {
	declare validity: TransferFile.Validity
	declare validityMessage: string

	constructor(file: File, validity: TransferFile.Validity = { valid: true }, validityMessage = "") {
		super([file], file.name, file)

		this.validity = validity
		this.validityMessage = validityMessage
	}
}

export namespace TransferFile {
	export interface Validity {
		/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/rangeOverflow) */
		rangeOverflow?: boolean
		/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/typeMismatch) */
		typeMismatch?: boolean
		/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/valid) */
		valid: boolean
	}
}
