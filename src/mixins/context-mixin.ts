import type { ContextCallback, ContextType, ExtractContext } from "context-protocol"
import type { CustomElementConstructor } from "typed-custom-elements"

import { addContextListener, getContextValue, removeContextListener, setContextValue } from "context-protocol/subscriptions"

/** Mixin that allows context callbacks. */
export const ContextConsumerMixin = <T extends CustomElementConstructor>(Element: T): T & ContextConsumerMixin.Constructor =>
	class ContextConsumerElement extends Element {
		addContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>, subscribe = null as unknown as boolean): void {
			addContextListener(this, context, callback, subscribe)
		}

		removeContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>): void {
			removeContextListener(this, context, callback)
		}

		getContextValue<T>(context: ExtractContext<T>): ContextType<T> | undefined {
			return getContextValue(this, context)
		}
	}

export namespace ContextConsumerMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		addContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>, subscribe?: boolean): void

		removeContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>): void
	}
}

/** Mixin that allows context assignment. */
export const ContextProviderMixin = <T extends CustomElementConstructor>(Element: T): T & ContextProviderMixin.Constructor =>
	class ContextProviderElement extends Element {
		setContextValue<T>(context: ExtractContext<T>, value: ContextType<T>): void {
			setContextValue(this, context, value)
		}
	}

export namespace ContextProviderMixin {
	export interface Constructor extends CustomElementConstructor<Mixin> {}

	export interface Mixin {
		setContextValue<T>(context: ExtractContext<T>, value: ContextType<T>): void
	}
}
