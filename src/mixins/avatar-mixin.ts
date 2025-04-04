import type { CustomElementConstructor } from "typed-custom-elements"

import { css } from "../api/css.ts"

/** Mixin to provide an easily styleable avatar image. */
export const AvatarMixin = <T extends CustomElementConstructor>(Element: T): T & AvatarMixin.Constructor =>
	class AvatarElement extends Element {
		static observedAttributes = ["src"]

		shadowRoot: ShadowRoot = Object.assign(this.attachShadow({ mode: "open" }), {
			adoptedStyleSheets: [
				css(`:host{display:inline-block;overflow:clip;cursor:default;-webkit-user-select:none;user-select:none}`, `img{aspect-ratio:1/1;object-fit:cover;width:100%}`),
			],
			innerHTML: "<slot>",
		})

		attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
			if (name === "src") {
				this.shadowRoot.innerHTML = newValue ? `<img src=${JSON.stringify(newValue)} alt="">` : "<slot>"
			}

			super.attributeChangedCallback?.(name, oldValue, newValue)
		}
	}

export namespace AvatarMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {}
}
