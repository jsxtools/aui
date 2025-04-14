import type { FilePickerAcceptType } from "../api/show-open-file-picker.ts";
import type { CustomElementConstructor } from "../types.ts";
import { DropMixin } from "./drop.ts";
/** A mixin to provide file drop and file picker support to a custom element. */
export declare const FileMixin: <T extends CustomElementConstructor>(Element: T) => T & FileMixin.Constructor;
export declare namespace FileMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin extends DropMixin.Mixin {
        files: TransferFile[];
        maxSize: number;
        multiple: boolean;
        types: FilePickerAcceptType[];
    }
}
export declare class TransferFile extends File {
    validity: TransferFile.Validity;
    validityMessage: string;
    constructor(file: File, validity?: TransferFile.Validity, validityMessage?: string);
}
export declare namespace TransferFile {
    interface Validity {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/rangeOverflow) */
        rangeOverflow?: boolean;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/typeMismatch) */
        typeMismatch?: boolean;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ValidityState/valid) */
        valid: boolean;
    }
}
