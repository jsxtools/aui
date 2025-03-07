import { mixinClick } from "../mixins/click.ts"
import { HTMLElement } from "../ssr/element.ts"

export class ClickElement extends mixinClick(HTMLElement) {}

export namespace ClickElement {
	export type Mixin = mixinClick.Mixin
}
