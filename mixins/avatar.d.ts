import type { CustomElementConstructor } from "../types.ts";
/** Mixin to provide an easily styleable avatar image. */
export declare const AvatarMixin: <T extends CustomElementConstructor>(Element: T) => T & AvatarMixin.Constructor;
export declare namespace AvatarMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
    }
}
