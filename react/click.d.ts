import { ClickElement } from "../elements/click.ts";
export declare const ClickComponent: (props: ClickComponent.Props) => import("react").DOMElement<ClickComponent.Props, ClickElement>;
export declare namespace ClickComponent {
    type Element = ClickElement;
    interface Props extends React.ComponentProps<"a-click"> {
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "a-click": ClickElement;
    }
}
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "a-click": React.DetailedHTMLProps<React.HTMLAttributes<ClickElement> & {}, ClickElement>;
        }
    }
}
