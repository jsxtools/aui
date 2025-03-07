import { mixinFormAssociated } from "../mixins/form-associated.ts"
import { HTMLElement } from "../ssr/element.ts"

export class FormAssociatedElement extends mixinFormAssociated(HTMLElement) {}

export namespace FormAssociatedElement {
	export type Mixin = mixinFormAssociated.Mixin
}
