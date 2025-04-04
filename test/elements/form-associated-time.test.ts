import { userEvent } from "@vitest/browser/context"
import { afterAll, beforeAll, expect, test } from "vitest"

import { FormAssociatedTimeElement } from "../../src/elements/form-associated-time-element.ts"

let element: FormAssociatedTimeElement
let form: HTMLFormElement

beforeAll(() => {
	customElements.define("test-form-associated-time", FormAssociatedTimeElement)

	element = new FormAssociatedTimeElement()

	element.name = "test-form-associated-time"

	form = document.createElement("form")

	form.appendChild(element)

	document.body.appendChild(form)
})

afterAll(() => {
	form.remove()
})

test("FormAssociatedTimeMixin handles time input", () => {
	// Test initial state
	expect(element.value).toBe("")

	// Test setting value via attribute
	element.setAttribute("value", "09:15")
	expect(element.value).toBe("09:15")

	// Test setting value via property
	element.value = "14:30"
	expect(element.value).toBe("14:30")

	// Test setting value via attribute fails after value is set via property
	element.setAttribute("value", "09:15")
	expect(element.value).toBe("14:30")

	// Test invalid value
	element.value = "invalid"
	expect(element.value).toBe("")

	// Test empty value
	element.value = ""
	expect(element.value).toBe("")

	element.value = "13:45"

	const formData = new FormData(form)

	expect(formData.get(element.name)).toBe("13:45")
})

test("FormAssociatedTimeMixin handles time segments", async () => {
	element.value = "13:45"

	// Test initial segment state
	const shadowRoot = element.shadowRoot!

	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	expect(hh.textContent).toBe("01")
	expect(mm.textContent).toBe("45")
	expect(dp.textContent).toBe("PM")

	// Reset the value
	element.value = ""

	// Test keyboard navigation
	await userEvent.keyboard("[Tab]")

	expect(document.activeElement).toBe(element)

	await userEvent.keyboard("1")
	expect(hh.textContent).toBe("01")
	expect(element.value).toBe("")

	await userEvent.keyboard("2")
	expect(hh.textContent).toBe("12")
	expect(element.value).toBe("")

	await userEvent.keyboard("3")
	expect(mm.textContent).toBe("03")
	expect(element.value).toBe("")

	await userEvent.keyboard("0")
	expect(mm.textContent).toBe("30")
	expect(element.value).toBe("")

	await userEvent.keyboard("P")
	expect(dp.textContent).toBe("PM")
	expect(element.value).toBe("12:30")

	// Test increment/decrement
	await userEvent.keyboard("[ArrowUp]")
	expect(dp.textContent).toBe("AM")
	expect(element.value).toBe("00:30")

	await userEvent.keyboard("[ArrowLeft][ArrowUp]")
	expect(mm.textContent).toBe("31")
	expect(element.value).toBe("00:31")

	await userEvent.keyboard("[ArrowLeft][ArrowUp]")
	expect(hh.textContent).toBe("01")
	expect(element.value).toBe("01:31")

	// Test decrement
	await userEvent.keyboard("[ArrowDown]")
	expect(hh.textContent).toBe("12")
	expect(element.value).toBe("00:31")

	await userEvent.keyboard("[ArrowRight][ArrowDown]")
	expect(mm.textContent).toBe("30")
	expect(element.value).toBe("00:30")

	await userEvent.keyboard("[ArrowRight][ArrowDown]")
	expect(dp.textContent).toBe("PM")
	expect(element.value).toBe("12:30")
})

test("FormAssociatedTimeMixin handles keyboard input", async () => {
	const element = document.body.appendChild(new FormAssociatedTimeElement())

	const shadowRoot = element.shadowRoot!
	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	element.focus()

	expect(element.value).toBe("")
	expect(hh.textContent).toBe("--")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing "1" should set the visible hour to "01" and keep focus on the visible hour
	await userEvent.keyboard("1")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("01")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing "2" should set the visible hour to "12" and focus the visible minute
	await userEvent.keyboard("2")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing Backspace should focus the visible hour again
	await userEvent.keyboard("[Backspace]")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing Backspace should unset the visible hour
	await userEvent.keyboard("[Backspace]")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("--")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")

	// pressing "p" should autoset the visible hour to "12", the visible minute to "00", the visible period to "PM", and focus the visible period
	await userEvent.keyboard("p")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("PM")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing backspace should unset the period and move focus back to the visible minute
	await userEvent.keyboard("[Backspace]")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing "6" should set the visible minute to "06" and move focus back to the visible period
	await userEvent.keyboard("6")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("06")
	expect(dp.textContent).toBe("--")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing "a" should set the visible period to "AM" and keep focus on the visible period
	await userEvent.keyboard("a")
	expect(element.value).toBe("00:06")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("06")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing ArrowBack should move the focus to the visible minute
	await userEvent.keyboard("[ArrowLeft]")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowBack should move the focus to the visible hour
	await userEvent.keyboard("[ArrowLeft]")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing "2" should set the visible hour to "02" and move the focus to the visible minute
	await userEvent.keyboard("2")
	expect(element.value).toBe("02:06")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("06")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing "2" should set the visible minute to "02" and keep the focus on the visible minute
	await userEvent.keyboard("2")
	expect(element.value).toBe("02:02")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("02")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing Backspace should unset the visible minute and keep the focus on the visible minute
	await userEvent.keyboard("[Backspace]")
	expect(element.value).toBe("")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing "2" should set the visible minute to "02" and keep the focus on the visible minute
	await userEvent.keyboard("2")
	expect(element.value).toBe("02:02")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("02")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowUp should increment the visible minute to "03" and keep the focus on the visible minute
	await userEvent.keyboard("[ArrowUp]")
	expect(element.value).toBe("02:03")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("03")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowDown should decrement the visible minute to "02" and keep the focus on the visible minute
	await userEvent.keyboard("[ArrowDown]")
	expect(element.value).toBe("02:02")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("02")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowDown 3 times should decrement the visible minute to "59" and keep the focus on the visible minute
	await userEvent.keyboard("[ArrowDown][ArrowDown][ArrowDown]")
	expect(element.value).toBe("02:59")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("59")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowUp should increment the visible minute to "00" and keep the focus on the visible minute
	await userEvent.keyboard("[ArrowUp]")
	expect(element.value).toBe("02:00")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(mm)

	// pressing ArrowRight should move focus to the visible period
	await userEvent.keyboard("[ArrowRight]")
	expect(element.value).toBe("02:00")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing ArrowUp should increment the visible period to "PM" and keep the focus on the visible period
	await userEvent.keyboard("[ArrowUp]")
	expect(element.value).toBe("14:00")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("PM")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing ArrowDown should decrement the visible period to "AM" and keep the focus on the visible period
	await userEvent.keyboard("[ArrowDown]")
	expect(element.value).toBe("02:00")
	expect(hh.textContent).toBe("02")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(dp)

	// pressing ArrowLeft twice should move focus to the visible hour
	await userEvent.keyboard("[ArrowLeft][ArrowLeft]")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing "1" should set the visible hour to "01" and keep focus on the visible hour
	await userEvent.keyboard("1")
	expect(element.value).toBe("01:00")
	expect(hh.textContent).toBe("01")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(hh)

	// pressing "6" should set the visible minute to "06" and move focus to the visible minute
	await userEvent.keyboard("6")
	expect(element.value).toBe("01:06")
	expect(hh.textContent).toBe("01")
	expect(mm.textContent).toBe("06")
	expect(dp.textContent).toBe("AM")
	expect(shadowRoot.activeElement).toBe(dp)

	element.remove()
})

test("FormAssociatedTimeMixin handles required validation", () => {
	element.required = true
	element.value = ""

	expect(element.internals.validity.valid).toBe(false)
	expect(element.internals.validationMessage).toBe("This field is required")

	element.value = "09:15"
	expect(element.internals.validity.valid).toBe(true)
	expect(element.internals.validationMessage).toBe("")

	element.value = ""
	expect(element.internals.validity.valid).toBe(false)
	expect(element.internals.validationMessage).toBe("This field is required")
})

test("FormAssociatedTimeMixin has correct ARIA attributes", () => {
	const shadowRoot = element.shadowRoot!
	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	expect(element.internals.ariaRoleDescription).toBe("time field")
	expect(hh.getAttribute("aria-label")).toBe("Hour, ")
	expect(mm.getAttribute("aria-label")).toBe("Minute, ")
	expect(dp.getAttribute("aria-label")).toBe("Day Period, ")
	expect(hh.getAttribute("role")).toBe("spinbutton")
	expect(mm.getAttribute("role")).toBe("spinbutton")
	expect(dp.getAttribute("role")).toBe("spinbutton")
})

test("FormAssociatedTimeMixin has correct shadow DOM structure", () => {
	const shadowRoot = element.shadowRoot!
	const segments = shadowRoot.querySelectorAll(".segment")!
	const separators = shadowRoot.querySelectorAll("[part^='separator']")!

	expect(segments.length).toBe(3)
	expect(separators.length).toBe(2)
	expect(segments[0]!.className).toBe("segment hh")
	expect(segments[1]!.className).toBe("segment mm")
	expect(segments[2]!.className).toBe("segment dp")
	expect(separators[0]!.textContent).toBe(":")
	expect(separators[1]!.textContent).toBe(" ")
})

test("FormAssociatedTimeMixin handles attribute changes", () => {
	const instance = document.body.appendChild(new FormAssociatedTimeElement())

	const shadowRoot = instance.shadowRoot!
	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	expect(instance.value).toBe("")
	expect(hh.textContent).toBe("--")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")

	instance.focus()

	expect(instance.validity.valid).toBe(true)

	instance.required = true

	expect(instance.validity.valid).toBe(false)

	instance.required = false

	expect(instance.validity.valid).toBe(true)

	instance.remove()
})

test("FormAssociatedTimeMixin handles keyboard input", async () => {
	const element = document.body.appendChild(new FormAssociatedTimeElement())

	element.focus()

	expect(element.value).toBe("")

	// @ts-expect-error testing for a bad value
	element.value = undefined

	expect(element.value).toBe("")

	// testing a non-sense value
	element.value = "NON-SENSE"

	expect(element.value).toBe("")

	element.remove()
})

test("FormAssociatedTimeMixin handles resets", () => {
	const form = document.body.appendChild(document.createElement("form"))
	const control = form.appendChild(new FormAssociatedTimeElement())

	// set control values
	control.name = "time"
	control.value = "01:05"

	const shadowRoot = control.shadowRoot!
	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	expect(control.value).toBe("01:05")
	expect(hh.textContent).toBe("01")
	expect(mm.textContent).toBe("05")
	expect(dp.textContent).toBe("AM")

	// reset form
	form.reset()

	expect(control.value).toBe("")
	expect(hh.textContent).toBe("--")
	expect(mm.textContent).toBe("--")
	expect(dp.textContent).toBe("--")
})

test("FormAssociatedTimeMixin handles edge cases", () => {
	// Test setting value with leading zeros
	element.value = "01:05"
	expect(element.value).toBe("01:05")

	// Test setting value with 24-hour format
	element.value = "23:59"
	expect(element.value).toBe("23:59")

	const shadowRoot = element.shadowRoot!
	const hh = shadowRoot.querySelector(".hh") as HTMLElement
	const mm = shadowRoot.querySelector(".mm") as HTMLElement
	const dp = shadowRoot.querySelector(".dp") as HTMLElement

	expect(hh.textContent).toBe("11")
	expect(mm.textContent).toBe("59")
	expect(dp.textContent).toBe("PM")

	// Test setting value at midnight
	element.value = "00:00"
	expect(element.value).toBe("00:00")
	expect(hh.textContent).toBe("12")
	expect(mm.textContent).toBe("00")
	expect(dp.textContent).toBe("AM")
})
