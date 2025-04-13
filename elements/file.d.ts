import { FileMixin, TransferFile } from "../mixins/file.ts";
declare const FileElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & FileMixin.Constructor;
/** A Custom Element with file-drop and file-picker support. */
export declare class FileElement extends FileElement_base {
}
export declare namespace FileElement {
    type Constructor = FileMixin.Constructor;
    type Mixin = FileMixin.Mixin;
}
export { TransferFile };
