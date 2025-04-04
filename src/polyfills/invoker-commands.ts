{
	const applyOnCommandHandler = (elements: HTMLElement[] | NodeListOf<HTMLElement>) => {
		for (const element of elements) {
			element.oncommand = new Function("event", element.getAttribute("oncommand")!) as any
		}
	}

	const observeShadowRoots = ({ prototype }: typeof HTMLElement, callback: (shadowRoot: ShadowRoot, ignoreToggle?: boolean) => void) => {
		const { attachInternals, attachShadow } = prototype

		Object.assign(prototype, {
			attachShadow(init: ShadowRootInit) {
				const shadowRoot = attachShadow.call(this, init)

				callback(shadowRoot)

				return shadowRoot
			},
			attachInternals() {
				const internals = attachInternals.call(this)

				if (internals.shadowRoot) callback(internals.shadowRoot)

				return internals
			},
		})
	}

	const commandEventSourceElements = new WeakMap<CommandEvent, Element>()
	const commandEventActions = new WeakMap<CommandEvent, string>()

	const oncommandObserver = new MutationObserver((records) => {
		for (const record of records) {
			const { target } = record
			if (record.type === "childList") {
				applyOnCommandHandler((target as HTMLElement).querySelectorAll("[oncommand]"))
			} else {
				applyOnCommandHandler([target as HTMLElement])
			}
		}
	})

	const commandAssociatedElements = new WeakMap<Element, HTMLElement>()

	const onHandlers = new WeakMap<HTMLElement, ((event: CommandEvent) => any) | null>()

	class CommandEvent extends Event {
		constructor(type: string, invokeEventInit = null as unknown as any) {
			const { source, command, ...init } = Object(invokeEventInit)

			super(type, init)

			if (source != null && !(source instanceof Element)) {
				throw new TypeError(`source must be an element`)
			}

			commandEventSourceElements.set(this, source || null)
			commandEventActions.set(this, command !== undefined ? String(command) : "")
		}

		get source() {
			if (!commandEventSourceElements.has(this)) {
				throw new TypeError("Illegal invocation")
			}

			const source = commandEventSourceElements.get(this)

			if (!(source instanceof Element)) return null

			const invokerRoot = source.getRootNode()
			const targetRoot = (this.target as Node)!.getRootNode()

			return invokerRoot !== targetRoot ? (invokerRoot as ShadowRoot).host : source
		}

		get command(): string {
			if (!commandEventActions.has(this)) {
				throw new TypeError("Illegal invocation")
			}

			return commandEventActions.get(this)!
		}
	}

	Object.assign(HTMLElement.prototype, {
		get oncommand() {
			oncommandObserver.takeRecords()

			return onHandlers.get(this) || null
		},
		set oncommand(handler: ((event: CommandEvent) => any) | null) {
			const existing = onHandlers.get(this) || null

			if (existing) {
				this.removeEventListener("command", existing)
			}

			onHandlers.set(this, typeof handler === "object" || typeof handler === "function" ? handler : null)

			if (typeof handler === "function") {
				this.addEventListener("command", handler)
			}
		},
	} as HTMLElement)

	const observeRoot = (root: Document | ShadowRoot, ignoreToggle = false) => {
		root.addEventListener(
			"beforetoggle",
			() => {
				ignoreToggle = true

				requestAnimationFrame(() => {
					ignoreToggle = false
				})
			},
			true,
		)

		root.addEventListener(
			"click",
			(event) => {
				if (event.defaultPrevented) return

				const source = (event.target as Element).closest<HTMLButtonElement>("button[commandfor], button[command]")

				if (!source) return

				const hasCommandAttr = source.hasAttribute("command")
				const hasCommandForAttr = source.hasAttribute("commandfor")

				if (hasCommandAttr !== hasCommandForAttr) {
					throw new Error(`Element with command${hasCommandAttr ? "" : "for"} attribute must also have a command${hasCommandAttr ? "for" : ""} attribute to function.`)
				}

				const invokee = source.commandForElement
				const command = source.command

				if (!invokee) return

				const commandEvent = new CommandEvent("command", {
					command,
					source,
					cancelable: true,
				})

				requestAnimationFrame(() => {
					if (invokee.dispatchEvent(commandEvent)) {
						const commandLower = commandEvent.command.toLowerCase()

						if (invokee.popover) {
							const canShow = !invokee.matches(":popover-open")
							const shouldShow = canShow && ((!ignoreToggle && commandLower === "toggle-popover") || commandLower === "show-popover")
							const shouldHide = !canShow && commandLower === "hide-popover"

							if (shouldShow) {
								invokee.showPopover({ source })
							} else if (shouldHide) {
								invokee.hidePopover()
							}
						} else if (invokee instanceof HTMLDialogElement) {
							const canShow = !invokee.open
							const shouldShow = canShow && commandLower === "show-modal"
							const shouldHide = !canShow && commandLower === "close"

							if (shouldShow) {
								invokee.showModal()
							} else if (shouldHide) {
								invokee.close()
							}
						}
					}
				})
			},
			true,
		)

		oncommandObserver.observe(root, {
			subtree: true,
			childList: true,
			attributeFilter: ["oncommand"],
		})

		applyOnCommandHandler(root.querySelectorAll("[oncommand]"))
	}

	observeRoot(document)

	Object.defineProperties(
		HTMLButtonElement.prototype,
		Object.getOwnPropertyDescriptors({
			set commandForElement(targetElement) {
				if (targetElement === null) {
					this.removeAttribute("commandfor")
					commandAssociatedElements.delete(this)
				} else if (!(targetElement instanceof Element)) {
					throw new TypeError(`commandForElement must be an element or null`)
				} else {
					this.setAttribute("commandfor", "")

					const targetRootNode = targetElement.getRootNode()
					const thisRootNode = this.getRootNode()

					if (thisRootNode === targetRootNode || targetRootNode === this.ownerDocument) {
						commandAssociatedElements.set(this, targetElement)
					} else {
						commandAssociatedElements.delete(this)
					}
				}
			},
			get commandForElement() {
				if (this.disabled) {
					return null
				}

				if (this.form && this.getAttribute("type") !== "button") {
					return null
				}

				const targetElement = commandAssociatedElements.get(this)

				if (targetElement) {
					if (targetElement.isConnected) {
						return targetElement
					}

					commandAssociatedElements.delete(this)

					return null
				}

				const root = this.getRootNode()
				const idref = this.getAttribute("commandfor")

				return idref && (root instanceof Document || root instanceof ShadowRoot) ? root.getElementById(idref) : null
			},
			get command(): "show-modal" | "close" | "toggle-popover" | "hide-popover" | "show-popover" | `--${string}` | "" {
				const value = this.getAttribute("command") ?? ""

				if (value.startsWith("--")) return value as `--${string}`

				const valueLower = value.toLowerCase()

				switch (valueLower) {
					case "show-modal":
					case "close":
					case "toggle-popover":
					case "hide-popover":
					case "show-popover":
						return valueLower
				}

				return ""
			},
			set command(value: string) {
				this.setAttribute("command", value)
			},
		} as HTMLButtonElement),
	)

	observeShadowRoots(HTMLElement, observeRoot)

	Object.assign(globalThis, { CommandEvent })
}
