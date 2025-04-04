import { HTMLElement } from "../api/html-element.ts"
import { ChildrenChangedMixin } from "../mixins/children-changed.ts"

/** A custom element that provides children observation support. */
export class ChildrenChangedElement extends ChildrenChangedMixin(HTMLElement) {}

export namespace ChildrenChangedElement {
	export type Constructor = ChildrenChangedMixin.Constructor
	export type Mixin = ChildrenChangedMixin.Mixin
}
