import type { CustomElementConstructor } from "../types.ts";
import { FormAssociatedMixin } from "./form-associated.ts";
/** Mixin to provide an easily styleable form associated checkbox. */
export declare const FormAssociatedCheckboxMixin: <T extends CustomElementConstructor>(Element: T) => T & FormAssociatedCheckboxMixin.Constructor;
export declare namespace FormAssociatedCheckboxMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends FormAssociatedMixin.Mixin {
        checked: boolean;
    }
}
