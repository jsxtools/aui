import type { CustomElementConstructor } from "../types.ts";
/** A mixin to provide keyboard-accessible click support to a custom element. */
export declare const ClickMixin: <T extends CustomElementConstructor>(Element: T) => T & ClickMixin.Constructor;
export declare namespace ClickMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
    }
}
