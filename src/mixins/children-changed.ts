import type { CustomElementConstructor } from "../api/dom.ts"

/** A mixin to provide children observation support to a custom element. */
export const ChildrenChangedMixin = <T extends CustomElementConstructor>(Element: T) =>
	class extends Element {
		constructor(...args: any[]) {
			const host = super(...args) as unknown as InstanceType<T> & ChildrenChangedMixin.Mixin
			const call = (host.childrenChangedCallback || noop).bind(host)
			const scan = new MutationObserver(call)

			// observe changes to the host
			scan.observe(host, { childList: true, characterData: true })

			// conditionally run childrenChangedCallback
			if (host.hasChildNodes()) {
				call()
			}
		}
	} as T & ChildrenChangedMixin.Constructor

const noop = () => {}

export namespace ChildrenChangedMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		childrenChangedCallback?(): void
	}
}
