import type { CustomElementConstructor } from "typed-custom-elements"

import { css } from "../api/css.ts"
import { FormAssociatedMixin } from "./form-associated-mixin.ts"

/** A mixin to provide form association time controls to a custom element. */
export const FormAssociatedTimeMixin = <T extends CustomElementConstructor>(Element: T): T & FormAssociatedTimeMixin.Constructor =>
	class FormAssociatedTimeElement extends FormAssociatedMixin(Element) {
		shadowRoot: ShadowRoot = Object.assign(this.attachShadow({ delegatesFocus: true, mode: "open" }), {
			adoptedStyleSheets: [
				css(
					`*{box-sizing:border-box}`,
					`:host{border-radius:0.125em;cursor:default;font-variant-numeric:tabular-nums;white-space:nowrap;background-color:Field;color:FieldText}`,
					`.segment{display:inline-flex;place-content:center;border-radius:0.125em;caret-color:transparent;outline:none;text-align:center;&:focus{background-color:SelectedItem;color:SelectedItemText}&.hh,&.mm{width:1.5em}&.dp{width:1.75em}}`,
				),
			],
		})

		constructor(...args: any[]) {
			const host = super(...args)! as FormAssociatedTimeElement

			host.internals.ariaRoleDescription = "time field"

			const segments = host.#segments

			host.shadowRoot.append(
				segments.hh,
				CREATE_SPAN({
					part: "separator mm",
					ariaHidden: "",
					textContent: ":",
				}),
				segments.mm,
				CREATE_SPAN({
					part: "separator dp",
					ariaHidden: "",
					textContent: " ",
				}),
				segments.dp,
			)

			host.addEventListener("focus", () => segments.hh.focus(), true)
		}

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "value") {
				if (newValue && this.#value === null) {
					this.value = newValue

					this.#value = null
				}
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)

			this.#updateValidity()
		}

		#segments = {
			/** Hour Segment Element */
			hh: CREATE_TIME_SEGMENT(
				/^(0|1)$/,
				/^(1[0-2]|0?[1-9])$/,
				(value) => value.padStart(2, "0"),
				(value) => String(Math.min((13 + Number(value) + 1) % 13 || 0, 12) || 1),
				(value) => String(Math.max((12 + Number(value) - 1) % 12 || 0, 0) || 12),
				"12",
				(hh) => {
					this.#values[0] = hh
					this.#onChange()
				},
				{
					className: "segment hh",
					part: "segment hh",
					ariaLabel: "Hour, ",
				},
			),
			/** Minute Segment Element */
			mm: CREATE_TIME_SEGMENT(
				/^[0-5]$/,
				/^[0-5]?[0-9]$/,
				(value) => value.padStart(2, "0"),
				(value) => String(Math.min((60 + Number(value) + 1) % 60 || 0, 59)),
				(value) => String(Math.max((60 + Number(value) - 1) % 60 || 0, 0)),
				"00",
				(mm) => {
					this.#values[1] = mm
					this.#onChange()
				},
				{
					className: "segment mm",
					part: "segment mm",
					ariaLabel: "Minute, ",
				},
			),
			/** Day-Period Segment Element */
			dp: CREATE_TIME_SEGMENT(
				/^$/,
				/^[AaPp]$/,
				(value) => (value[0] === "P" || value[0] === "p" ? "PM" : "AM"),
				(value) => (value === "AM" ? "PM" : "AM"),
				(value) => (value === "AM" ? "PM" : "AM"),
				"AM",
				(dp) => {
					this.#values[2] = dp
					this.#onChange()
				},
				{
					className: "segment dp",
					part: "segment dp",
					ariaLabel: "Day Period, ",
				},
			),
		}

		#values = ["--", "--", "--"]

		#value: string | null = null

		#onChange() {
			const [hh, mm, dp] = this.#values
			const oldValue = this.#value ?? ""
			const newValue = hh === "--" || mm === "--" || dp === "--" ? "" : `${String((Number(hh) % 12) + (dp === "PM" ? 12 : 0)).padStart(2, "0")}:${mm}`

			if (oldValue !== newValue) {
				this.#updateForm((this.#value = newValue))

				this.dispatchEvent(new Event("input", { bubbles: true }))
				this.dispatchEvent(new Event("change", { bubbles: true }))
			}
		}

		#updateForm(value: string) {
			this.internals.setFormValue((this.#value = value))

			this.#updateValidity()
		}

		#updateValidity() {
			if (this.value || !this.required) {
				this.internals.setValidity({})
			} else {
				this.internals.setValidity({ valueMissing: true }, "This field is required")
			}
		}

		formResetCallback(): void {
			this.value = this.getAttribute("value") ?? ""

			this.#value = null
		}

		get value(): string {
			return this.#value ?? this.getAttribute("value") ?? ""
		}

		set value(time: string) {
			const [, hh, mm] = String(time ?? "").match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) ?? []

			if (hh && mm) {
				const hhNumber = Number(hh)
				const value = `${hh.padStart(2, "0")}:${mm}`

				if (value !== this.#value) {
					this.#updateForm((this.#value = value))

					this.#segments.hh.textContent = String(hhNumber % 12 || 12).padStart(2, "0")
					this.#segments.mm.textContent = mm
					this.#segments.dp.textContent = Number(hh) >= 12 ? "PM" : "AM"
				}
			} else if (this.#value !== "") {
				this.#updateForm((this.#value = ""))

				this.#segments.hh.textContent = "--"
				this.#segments.mm.textContent = "--"
				this.#segments.dp.textContent = "--"
			}
		}
	}

export namespace FormAssociatedTimeMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin extends FormAssociatedMixin.Mixin {
		shadowRoot: ShadowRoot
		value: string
	}
}

// #region Internal

/** Creates a Time Segment element with the given capabilities and props. */
const CREATE_TIME_SEGMENT = (
	/** RegExp to match the beginning of the time value. */
	matchLead: RegExp,

	/** RegExp to match the full time value. */
	matchFull: RegExp,

	/** Function to return a masked time value. */
	mask: CREATE.Mask,

	/** Function to return an incremented time value. */
	maskInc: CREATE.Mask,

	/** Function to return a decremented time value. */
	maskDec: CREATE.Mask,

	/** Text used when the time value is skipped. */
	fallback: string,

	/** Callback invoked when the time value changes. */
	callback: CREATE.Callback,

	/** Properties assigned to the time segment element. */
	props: CREATE.Props,
): HTMLSpanElement => {
	let partialValue = ""
	let currentValue = ""

	return CREATE_SPAN({
		role: "spinbutton",
		contentEditable: "true",
		spellcheck: false,
		autocapitalize: "off",
		enterKeyHint: "next",
		inputMode: "numeric",
		textContent: "--",
		onkeydown(event) {
			const prevTarget = this.previousSibling?.previousSibling as HTMLElement
			const nextTarget = this.nextSibling?.nextSibling as HTMLElement

			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault()

					prevTarget?.focus()

					partialValue = currentValue = ""

					break

				case "ArrowRight":
					event.preventDefault()

					nextTarget?.focus()

					partialValue = currentValue = ""

					break

				case "ArrowUp":
					event.preventDefault()

					callback((this.textContent = mask(maskInc(this.textContent!))))

					break

				case "ArrowDown":
					event.preventDefault()

					callback((this.textContent = mask(maskDec(this.textContent!))))

					break

				// Safari won't always fire `beforeinput`, so we dispatch it manually
				case "Backspace":
					event.preventDefault()

					event.currentTarget?.dispatchEvent(
						new InputEvent("beforeinput", {
							inputType: "deleteContentBackward",
						}),
					)

					break
			}
		},
		onbeforeinput(event) {
			event.preventDefault()

			partialValue = currentValue

			const next = this.nextSibling?.nextSibling as HTMLElement
			const prev = this.previousSibling?.previousSibling as HTMLElement

			if (event.inputType === "deleteContentBackward") {
				if (partialValue) {
					partialValue = currentValue = currentValue.slice(0, -1)

					if (partialValue === "") {
						partialValue = currentValue = ""

						callback((this.textContent = "--"))

						return
					}
				} else {
					partialValue = currentValue = ""

					callback((this.textContent = "--"))

					prev?.focus()

					return
				}
			} else {
				partialValue += event.data
			}

			// validate if the pending value matches either `matchPartial` or `matchFilled`; then,
			// 1. if it matches `matchPartial`, then update and continue; otherwise,
			// 2. if it matches `matchFilled`, then update and move focus to the next focusable element; otherwise,
			// 3. if it does not match either, then validate if the existing value matches `matchFilled`; then,
			//    • if it matches `matchFilled`, then update and continue; otherwise,
			//    • if it does not match, then update the content to `skipText`; then,
			// 4. move focus to the next tabbable element, dispatching this same validation.

			if (matchLead.test(partialValue)) {
				// 1.
				currentValue = partialValue

				callback((this.textContent = mask(partialValue)))
			} else if (matchFull.test(partialValue)) {
				// 2.
				callback((this.textContent = mask(partialValue)))

				currentValue = partialValue = ""

				next?.focus()
			} else {
				// 3.
				callback((this.textContent = matchFull.test(currentValue) ? mask(currentValue) : fallback))

				currentValue = partialValue = ""

				// 4.
				if (next) {
					next.focus()
					next.dispatchEvent(new InputEvent(event.type, event))
				}
			}
		},

		...props,
	})
}

/** Creates a <span> with the given props. */
const CREATE_SPAN = (props: CREATE.Props): HTMLSpanElement => Object.assign(document.createElement("span"), props)

namespace CREATE {
	export type Callback = (value: string) => void

	export type Mask = (value: string) => string

	export interface Props {
		ariaHidden?: string
		ariaLabel?: string
		autocapitalize?: string
		className?: string
		contentEditable?: string
		enterKeyHint?: string
		inputMode?: string
		part?: string
		role?: string
		spellcheck?: boolean
		textContent?: string

		onbeforeinput?(this: HTMLSpanElement, event: InputEvent): void
		onkeydown?(this: HTMLSpanElement, event: KeyboardEvent): void
	}
}

// #endregion
