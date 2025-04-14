import type { CustomElementConstructor } from "../types.ts";
import { FormAssociatedMixin } from "./form-associated.ts";
/** A mixin to provide form association time controls to a custom element. */
export declare const FormAssociatedTimeMixin: <T extends CustomElementConstructor>(Element: T) => T & FormAssociatedTimeMixin.Constructor;
export declare namespace FormAssociatedTimeMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends FormAssociatedMixin.Mixin {
        value: string;
    }
}
