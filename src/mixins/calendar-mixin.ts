import type { CustomElementConstructor } from "typed-custom-elements"

import { css } from "../api/css.ts"
import { $create } from "../api/dom.ts"

/** Mixin to provide an accessible, keyboard-navigable calendar interface. */
export const CalendarMixin = <T extends CustomElementConstructor>(Element: T): T & CalendarMixin.Constructor =>
	class CalendarElement extends Element {
		static observedAttributes = ["src"]

		shadowRoot: ShadowRoot = Object.assign(this.attachShadow({ mode: "open" }), {
			adoptedStyleSheets: [
				css(
					"button{appearance:unset;background-color:unset;border-width:0;color:unset;font:unset;margin:0;padding:0;}",
					"table{border-collapse:collapse;text-align:center;}",
					"td,th{padding:0;}",
					":host::part(header){display:grid;align-items:center;grid-template-columns:auto 1fr auto;margin-bottom:0.5rem;text-align:center;}",
					":host::part(button){min-height:2rem;min-width:2rem}",
					":host::part(day){font-variant-numeric:tabular-nums;block-size:2.25rem;inline-size:2.25rem;}",
					'[aria-disabled="true"]>*{display:none}',
					"table{width: 100%; cursor: default; -webkit-user-select: none; user-select: none;}",
					"td{border-radius:0.25rem;min-height:1.625rem;min-width: 2rem;}",
				),
			],
		})

		constructor(...args: any[]) {
			super(...args)! as CalendarElement

			this.#heading = new Text()

			const $prev = $create("button", { ariaLabel: "Previous", part: "button previous" }, "◀")
			const $next = $create("button", { ariaLabel: "Next", part: "button next" }, "▶")
			const $tbody = $create("tbody")

			const $table = $create(
				"table",
				{
					part: "grid",
					role: "grid",
					ariaLabel: `Date`,
				},
				$create(
					"thead",
					$create(
						"tr",
						...getLocalizedWeekdays().map(([narrowDay, fullDay]) => {
							const $td = $create(
								"th",
								{
									scope: "col",
								},
								$create(
									"span",
									{
										ariaLabel: fullDay,
									},
									narrowDay,
								),
							)

							return $td
						}),
					),
				),
				$tbody,
			)

			const $app = $create(
				"div",
				{
					role: "application",
					ariaLabel: "Date",
				},
				$create(
					"span",
					{
						part: "header",
					},
					$prev,
					$create("span", { ariaHidden: "true", part: "heading" }, this.#heading),
					$next,
				),
				$table,
			)

			this.#grid = Array.from({ length: 42 }, (_, offset): Cell => {
				const date = getGridDateWithOffset(this.#selected, offset)
				const text = new Text(String(date.getDate()))

				const button = $create(
					"button",
					{
						part: "day",
						ariaLabel: "",
						ariaPressed: false,
						tabIndex: -1,
					},
					text,
				)

				const cell = $create(
					"td",
					{
						role: "gridcell",
						part: "cell",
					},
					button,
				)

				const $tr = offset % 7 ? ($tbody.lastChild as HTMLTableRowElement) : $tbody.appendChild(document.createElement("tr"))

				$tr.append(cell)

				return { button, date, text, offset }
			})

			$app.addEventListener(
				"keydown",
				(event: KeyboardEvent) => {
					let delta = 0

					switch (event.key) {
						case "ArrowLeft":
							delta = -1
							break
						case "ArrowRight":
							delta = +1
							break
						case "ArrowUp":
							delta = -7
							break
						case "ArrowDown":
							delta = +7
							break
						default:
							return
					}

					event.preventDefault()

					this.#update(getDateWithOffset(this.#focused, delta, "Date"))

					for (const cell of this.#grid) {
						if (isSameDay(cell.date, this.#focused)) {
							cell.button.focus()

							break
						}
					}
				},
				true,
			)

			$app.addEventListener(
				"click",
				(event: MouseEvent) => {
					if ($next.contains(event.target as Element)) {
						this.#update(getDateWithOffset(this.#focused, 1, "Month"))
					} else if ($prev.contains(event.target as Element)) {
						this.#update(getDateWithOffset(this.#focused, -1, "Month"))
					} else if ($tbody.contains(event.target as Element)) {
						for (const cell of this.#grid) {
							if (cell.button.contains(event.target as Element)) {
								this.#update((this.#selected = cell.date))

								break
							}
						}
					}
				},
				true,
			)

			this.shadowRoot.replaceChildren($app)

			this.#update(this.#selected)
		}

		#focused = new Date()
		#selected = new Date()

		#grid: Cell[]
		#heading: Text

		#update(focused: Date) {
			this.#focused = focused

			const year = focused.getFullYear()
			const month = focused.getMonth()
			const start = new Date(year, month, 1)
			const startDay = start.getDay()
			const first = new Date(year, month, 1 - startDay)

			this.#heading.data = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(focused)

			for (const cell of this.#grid) {
				cell.date = getDateWithOffset(first, cell.offset, "Date")

				const isFocusedMonth = isSameMonth(cell.date, focused)
				const isFocusedDay = isSameDay(cell.date, focused)
				const isSelectedDay = isSameDay(cell.date, this.#selected)
				const cellDate = String(cell.date.getDate())

				// update cell text
				if (cellDate !== cell.text.data) {
					cell.text.data = String(cell.date.getDate())
				}

				// update cell button
				cell.button.ariaLabel = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(cell.date)
				cell.button.tabIndex = isFocusedDay ? 0 : -1
				cell.button.ariaPressed = String(isSelectedDay)
				cell.button.part.toggle("focused", isFocusedDay)
				cell.button.part.toggle("selected", isSelectedDay)
				cell.button.part.toggle("disabled", !isFocusedMonth)
			}
		}
	}

export namespace CalendarMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		shadowRoot: ShadowRoot
	}
}

const getLocalizedWeekdays = (locale = "en"): [string, string][] => {
	const formatWeekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format
	const formatLongWeekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format

	return Array.from({ length: 7 }, (_, i) => [formatWeekday(new Date(2021, 7, i + 1)), formatLongWeekday(new Date(2021, 7, i + 1))])
}

/** Returns true if both dates fall within the same calendar month and year.. */
const isSameMonth = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

/** Returns true if both dates represent the exact same calendar day. */
const isSameDay = (a: Date, b: Date) => isSameMonth(a, b) && a.getDate() === b.getDate()

/** Returns a new Date object representing the day at the specified offset from the start of the calendar grid. */
const getGridDateWithOffset = (monthDate: Date, dayOffset: number): Date => {
	const base = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)

	base.setDate(1 - base.getDay() + dayOffset)

	return base
}

const getDateWithOffset = (base: Date, number: number, unit?: DateUnit | "Week") => {
	const date = new Date(base)

	if (unit === "Week") {
		date.setDate(base.getDate() + number * 7)
	} else {
		date[`set${unit}` as Setter<typeof unit>](date[`get${unit}` as Getter<typeof unit>]() + number)
	}

	return date
}

interface Cell {
	button: HTMLButtonElement
	date: Date
	offset: number
	text: Text
}

type DateUnit = "FullYear" | "Month" | "Week" | "Date" | "Hours" | "Minutes" | "Seconds" | "Time"

type Getter<T> = T extends DateUnit ? `get${T}` : `getTime`
type Setter<T> = T extends DateUnit ? `set${T}` : `setTime`
