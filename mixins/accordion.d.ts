import type { CustomElementConstructor } from "../types.ts";
/** Mixin to provide collapsible sections by headings. */
export declare const AccordionMixin: <T extends CustomElementConstructor>(Element: T) => T & AccordionMixin.Constructor;
export declare class AccordionDisclosure {
    get title(): HTMLElement;
    get panel(): Node[];
    get open(): boolean;
    set open(value: boolean);
}
export declare namespace AccordionMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
    }
}
