import type { CustomElementConstructor } from "../api/dom.ts";
import { InternalsMixin } from "./internals.ts";
/** A mixin to provide drop support to a custom element. */
export declare const DropMixin: <T extends CustomElementConstructor>(Element: T) => T & DropMixin.Constructor;
export declare namespace DropMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends InternalsMixin.Mixin {
    }
}
declare global {
    interface HTMLElementEventMap {
        dropenter: DragEvent;
        dropleave: DragEvent;
    }
}
