import type { CustomElementConstructor } from "../api/dom.ts";
/** Mixin to provide the ElementInternals API to a custom element. */
export declare const InternalsMixin: <T extends CustomElementConstructor>(Element: T) => T & InternalsMixin.Constructor;
export declare namespace InternalsMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
        internals: ElementInternals;
    }
}
