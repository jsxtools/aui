import { CalendarMixin } from "../mixins/calendar-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with an accessible, keyboard-navigable calendar interface. */
export class CalendarElement extends CalendarMixin(HTMLElement) {}

export namespace CalendarElement {
	export type Constructor = CalendarMixin.Constructor
	export type Mixin = CalendarMixin.Mixin
}
