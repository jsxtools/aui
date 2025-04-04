import { ChildrenChangedMixin } from "../mixins/children-changed-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element that provides children observation support. */
export class ChildrenChangedElement extends ChildrenChangedMixin(HTMLElement) {}

export namespace ChildrenChangedElement {
	export type Constructor = ChildrenChangedMixin.Constructor
	export type Mixin = ChildrenChangedMixin.Mixin
}
