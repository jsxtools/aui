import { InternalsElement } from "../elements/internals.ts";
/** A component that provides the ElementInternals API. */
export declare const InternalsComponent: (props: InternalsComponent.Props) => import("react").DOMElement<InternalsComponent.Props, InternalsElement>;
export declare namespace InternalsComponent {
    type Element = InternalsElement;
    interface Props extends React.ComponentProps<"a-internals"> {
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "a-internals": InternalsElement;
    }
}
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "a-internals": React.DetailedHTMLProps<React.HTMLAttributes<InternalsElement> & {}, InternalsElement>;
        }
    }
}
