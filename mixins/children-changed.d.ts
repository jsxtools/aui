import type { CustomElementConstructor } from "../types.ts";
/** A mixin to provide children observation support to a custom element. */
export declare const ChildrenChangedMixin: <T extends CustomElementConstructor>(Element: T) => T & ChildrenChangedMixin.Constructor;
export declare namespace ChildrenChangedMixin {
    interface Constructor extends CustomElementConstructor<Mixin> {
    }
    interface Mixin {
        /** Called when element's children change. */
        childrenChangedCallback?(addedNodes: Node[], removedNodes: Node[]): void;
    }
}
