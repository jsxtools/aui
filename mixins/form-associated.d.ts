import type { CustomElementConstructor } from "../types.ts";
import { InternalsMixin } from "./internals.ts";
/** A mixin to provide form association and validation support to a custom element. */
export declare const FormAssociatedMixin: <T extends CustomElementConstructor>(Element: T) => T & FormAssociatedMixin.Constructor;
export declare namespace FormAssociatedMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends InternalsMixin.Mixin {
        defaultValue: string;
        disabled: boolean;
        form: HTMLFormElement | null;
        name: string;
        required: boolean;
        validationMessage: string;
        validity: ValidityState;
        willValidate: boolean;
        checkValidity(): boolean;
        setCustomValidity(message: string): void;
        reportValidity(): boolean;
    }
}
