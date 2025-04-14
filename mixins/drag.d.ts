import type { CustomElementConstructor } from "../types.ts";
import { InternalsMixin } from "./internals.ts";
/** A mixin to provide drag support to a custom element. */
export declare const DragMixin: <T extends CustomElementConstructor>(Element: T) => T & DragMixin.Constructor;
export declare namespace DragMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends InternalsMixin.Mixin {
    }
}
