import type { FilePickerAcceptType } from "show-open-file-picker/types"
import type { CustomElementConstructor } from "typed-custom-elements"

import { DropMixin } from "./drop-mixin.ts"

/** A mixin to provide file drop and file picker support to a custom element. */
export const FileMixin = <T extends CustomElementConstructor>(Element: T): T & FileMixin.Constructor =>
	class FileElement extends DropMixin(Element) {
		maxSize = Number.POSITIVE_INFINITY

		get multiple(): boolean {
			return this.hasAttribute("multiple")
		}

		set multiple(value: boolean) {
			this.toggleAttribute("multiple", value)
		}

		get files(): FileMixin.Mixin["files"] {
			return [...this.#files]
		}

		types: FilePickerAcceptType[] = [
			{
				description: "All Files",
				accept: {
					"*/*": [],
				},
			},
		]

		#files: FileMixin.Mixin["files"] = []

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

				if (!this.multiple) {
					break
				}
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

		constructor(...args: any[]) {
			const host = super(...args)! as FileElement
			host.addEventListener("drop", host.#handleDrop, true)
			host.addEventListener("click", host.#handleClick, true)
		}
	}

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
