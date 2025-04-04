import type { CustomElementConstructor } from "../types.ts"

/** A mixin to provide children observation support to a custom element. */
export const ChildrenChangedMixin = <T extends CustomElementConstructor>(Element: T): T & ChildrenChangedMixin.Constructor =>
	class extends Element {
		constructor(...args: any[]) {
			const host = super(...args) as unknown as InstanceType<T> & ChildrenChangedMixin.Mixin
			const call = (host.childrenChangedCallback || noop).bind(host)
			const scan = new MutationObserver((records) => {
				for (const record of records) {
					call([...record.addedNodes], [...record.removedNodes])
				}
			})

			// observe changes to the host
			scan.observe(host, { childList: true })

			// conditionally run childrenChangedCallback
			queueMicrotask(() => {
				if (host.childNodes.length) {
					scan.takeRecords()

					call([...host.childNodes], [])
				}
			})
		}
	}

const noop = () => {}

export namespace ChildrenChangedMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		/** Called when element's children change. */
		childrenChangedCallback?(addedNodes: Node[], removedNodes: Node[]): void
	}
}
