import type { CustomElementConstructor } from "../api/dom.ts";
import { FileMixin } from "./file.ts";
import { FormAssociatedMixin } from "./form-associated.ts";
/** A mixin to provide form association and validation to a custom element. */
export declare const FormAssociatedFileMixin: <T extends CustomElementConstructor>(Element: T) => T & FormAssociatedFileMixin.Constructor;
export declare namespace FormAssociatedFileMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends FormAssociatedMixin.Mixin, FileMixin.Mixin {
    }
}
