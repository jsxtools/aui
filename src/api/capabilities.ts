export const attachCapabilities = <T extends HTMLElement, C extends CapabilitiesCallback<T>>(
	host: T,
	init = null as unknown as CapabilitiesInit,
	callback = null as unknown as C,
) => {
	const { mode, ...props } = Object(init) as CapabilitiesInit
	const internals = host.attachInternals()

	if (mode) host.attachShadow({ mode, ...props })

	for (const name in props) {
		if (name in internals) {
			// @ts-ignore because it cannot compute the key of property
			internals[name] = props[name]
		} else if (name in internals.shadowRoot!) {
			// @ts-ignore because it cannot compute the key of property
			internals.shadowRoot[name] = props[name]
		}
	}

	return (callback?.(host, internals) ?? internals) as ReturnType<C> extends void ? ElementInternals : ReturnType<C>
}

export interface CapabilitiesInit extends Partial<ARIAMixin> {
	adoptedStyleSheets?: CSSStyleSheet[]
	delegatesFocus?: boolean
	innerHTML?: string
	mode?: ShadowRootMode
	serializable?: boolean
	slotAssignment?: SlotAssignmentMode
}

export type CapabilitiesCallback<T extends HTMLElement> = (host: T, internals: ElementInternals) => void
