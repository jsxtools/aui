import type { CustomElementConstructor } from "typed-custom-elements"

/** A mixin to provide toast notifications. */
export const ToastListMixin = <T extends CustomElementConstructor>(Element: T): T & ToastListMixin.Constructor =>
	class ToastListElement extends Element {
		#messages = new Map<ToastListMixin.Props, HTMLDivElement>()
		#styling = new CSSStyleSheet()
		#timer = -1

		shadowRoot: ShadowRoot = Object.assign(
			this.attachShadow({
				delegatesFocus: true,
				mode: "open",
			}),
			{
				adoptedStyleSheets: [this.#styling],
			},
		)

		internals: ElementInternals = Object.assign(this.attachInternals(), {
			role: "dialog",
			ariaModal: "false",
		})

		constructor(...args: any) {
			const host = super(...args)! as ToastListElement

			host.addEventListener("command", (event) => {
				if (event.command === "--add") {
					host.add({ ...(event.source as HTMLElement).dataset })

					host.internals.ariaLabel = `${host.children.length} notifications`

					host.showPopover()
				}
			})

			this.addEventListener("pointerenter", this.#handlePointerEnter)
			this.addEventListener("pointerleave", this.#handlePointerLeave)
		}

		#getRenderedElement(props: Record<string, unknown>): HTMLDivElement {
			if (!this.#messages.has(props)) {
				const templateElement = this.querySelector("template") || document.createElement("template")

				const renderedElement = document.createElement("div")

				for (const attr of templateElement.attributes) {
					renderedElement.setAttributeNode(attr.cloneNode() as Attr)
				}

				renderedElement.append(templateElement.content.cloneNode(true))

				renderedElement.addEventListener("click", (event) => {
					const button = (event.target as HTMLElement).closest("button")

					if (button) {
						renderedElement.remove()

						this.#messages.delete(props)

						this.#assignRenderedElements()
					}
				})

				this.#messages.set(props, renderedElement)

				this.#assignRenderedElements()

				return renderedElement
			}

			return this.#messages.get(props)!
		}

		#handlePointerEnter() {
			clearTimeout(this.#timer)
		}

		#handlePointerLeave() {
			this.#handlePointerEnter()

			this.#timer = setTimeout(() => this.#dismiss(), 5000) as unknown as number
		}

		#dismiss() {
			this.internals.states.add("closing")

			Promise.all(this.getAnimations().map((animation) => animation.finished)).then(() => {
				this.#clear()
			})
		}

		#clear() {
			this.internals.states.delete("closing")

			this.#messages.clear()

			this.shadowRoot.replaceChildren()

			this.togglePopover(false)
		}

		#assignRenderedElements(): void {
			let index = 0

			for (const [, element] of this.#messages) {
				element.style.setProperty("--toast-index", String(++index))
			}

			while (this.#styling.cssRules.length) {
				this.#styling.deleteRule(0)
			}

			this.#styling.insertRule(`:host{--toast-count:${index}}`, 0)
		}

		add(props?: Record<string, unknown>): void {
			props = Object(props)

			requestAnimationFrame(() => {
				const renderedElement = this.#getRenderedElement(props!)

				for (const name in props) {
					const part = renderedElement.querySelector(`[slot=${JSON.stringify(name)}]`)

					if (part) {
						part.textContent = props[name] as string
					}
				}

				if (!renderedElement.parentNode) {
					this.shadowRoot.append(renderedElement)
				}

				this.internals.states.delete("closing")

				this.showPopover()

				clearTimeout(this.#timer)

				this.#timer = setTimeout(() => this.#dismiss(), 5000) as unknown as number
			})
		}
	}

export namespace ToastListMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		internals: ElementInternals
		shadowRoot: ShadowRoot
	}

	export interface Props extends Record<string, unknown> {}
}
