import { HTMLElement } from "../api/dom.ts"
import { ChildrenChangedMixin } from "../mixins/children-changed.ts"

/** A Custom Element with keyboard-accessible click support. */
export class ChildrenChangedElement extends ChildrenChangedMixin(HTMLElement) {}

export namespace ChildrenChangedElement {
	export type Constructor = ChildrenChangedMixin.Constructor
	export type Mixin = ChildrenChangedMixin.Mixin
}
