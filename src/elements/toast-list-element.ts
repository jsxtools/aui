import { ToastListMixin } from "../mixins/toast-list-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element to provide toast notifications. */
export class ToastListElement extends ToastListMixin(HTMLElement) {}

export namespace ToastElement {
	export type Constructor = ToastListMixin.Constructor
	export type Mixin = ToastListMixin.Mixin
	export type Props = ToastListMixin.Props
}
