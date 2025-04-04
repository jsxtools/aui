declare global {
	interface ShowPopoverOptions {
		source?: HTMLElement
	}

	interface CommandEvent extends Event {
		source: Element
		command: string
	}

	interface GlobalEventHandlersEventMap {
		command: CommandEvent
	}

	interface HTMLButtonElement {
		commandForElement: HTMLElement | null
		command: "show-modal" | "close" | "hide-popover" | "toggle-popover" | "show-popover" | `--${string}` | ""
	}

	interface Window {
		CommandEvent: CommandEvent
	}

	interface HTMLElement {
		oncommand: ((event: CommandEvent) => any) | null
		showPopover(options?: ShowPopoverOptions): void
	}
}

export type {}
