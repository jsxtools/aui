import { DropElement } from "../elements/drop.ts";
export declare const DropComponent: (props: DropComponent.Props) => import("react").DOMElement<DropComponent.Props, DropElement>;
export declare namespace DropComponent {
    type Element = DropElement;
    interface Props extends React.ComponentProps<"a-drop"> {
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "a-drop": DropElement;
    }
}
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "a-drop": React.DetailedHTMLProps<React.HTMLAttributes<DropElement> & {}, DropElement>;
        }
    }
}
