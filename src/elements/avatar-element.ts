import { AvatarMixin } from "../mixins/avatar-mixin.ts"
import { HTMLElement } from "../ssr/html-element.ts"

/** Element with an easily styleable avatar image. */
export class AvatarElement extends AvatarMixin(HTMLElement) {}

export namespace AvatarElement {
	export type Constructor = AvatarMixin.Constructor
	export type Mixin = AvatarMixin.Mixin
}
