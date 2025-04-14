import { FileMixin, TransferFile } from "../mixins/file.ts";
declare const FileElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & FileMixin.Constructor;
/** A custom element with file-drop and file-picker support. */
export declare class FileElement extends FileElement_base {
}
export declare namespace FileElement {
    type Constructor = FileMixin.Constructor;
    type Mixin = FileMixin.Mixin;
}
export { TransferFile };
