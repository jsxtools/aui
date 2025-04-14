import type { CustomElementConstructor } from "../types.ts";
/** Mixin to provide the ElementInternals API to a custom element. */
export declare const InternalsMixin: <T extends CustomElementConstructor>(Element: T) => T & InternalsMixin.Constructor;
export declare namespace InternalsMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
        /** Interface for managing the element’s internal states, such as ARIA roles and ARIA labels, or participating in form submissions and validations. [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) */
        internals: ElementInternals;
    }
}
