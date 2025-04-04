import { AlertDialogMixin } from "../mixins/alert-dialog-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that requires user response to proceed. */
export class AlertDialogElement extends AlertDialogMixin(HTMLElement) {}

export namespace AlertDialogElement {
	export type Constructor = AlertDialogMixin.Constructor
	export type Mixin = AlertDialogMixin.Mixin
}
