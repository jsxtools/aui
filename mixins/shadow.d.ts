import type { CustomElementConstructor } from "../types.ts";
/** A mixin to provide a configurable ShadowRoot to a custom element. */
export declare const ShadowMixin: <T extends CustomElementConstructor>(Element: T) => T & ShadowMixin.Constructor;
export declare namespace ShadowMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
        shadowRootMode: ShadowRootMode;
        shadowRootDelegatesFocus: boolean;
        shadowRootSerializable: boolean;
        shadowRootSlotAssignment: SlotAssignmentMode;
        shadowRootInnerHTML: string | null;
        shadowRootAdoptedStyleSheets: CSSStyleSheet[];
    }
    interface Mixin extends HTMLElement {
        shadowRoot: ShadowRoot;
    }
}
