import { HTMLElement } from "../api/html-element.ts"
import { AvatarMixin } from "../mixins/avatar.ts"

/** A custom element with an easily styleable avatar image. */
export class AvatarElement extends AvatarMixin(HTMLElement) {}

export namespace AvatarElement {
	export type Constructor = AvatarMixin.Constructor
	export type Mixin = AvatarMixin.Mixin
}
