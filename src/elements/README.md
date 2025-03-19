# Elements

A collection of custom elements that provide special functionality:

- **[Click](#click)**: A custom element that provides keyboard-accessible click support.
- **[Drop](#drop)**: A custom element that provides drag-and-drop support with visual state feedback.
- **[Internals](#internals)**: A custom element that provides the ElementInternals API.
- **[Shadow](#shadow)**: A custom elements that provides a configurable ShadowRoot.
- **[Form-Associated](#form-associated)**: A custom element that provides form association and validation support.
- **[Form-Associated File](#form-associated-file)**: A custom element that provides file upload support with form association and validation.

## Click

The **Click** custom element provides keyboard-accessible click support.

```ts
import { ClickElement } from "@jsxtools/aui/elements/click"

class MyClickElement extends ClickElement {
  // your own functionality goes here
}

customElements.define("my-click", MyClickElement)
```

## Drop

The **Drop** custom element provides drag-and-drop support.

```ts
import { DropElement } from "@jsxtools/aui/elements/drop"

class MyDropElement extends DropElement {
  // your own functionality goes here
}

customElements.define("a-drop", MyDropElement)
```

## Internals

The **Internals** custom element provides the [`ElementInternals` API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals).

```ts
import { InternalsElement } from "@jsxtools/aui/elements/internals"

class MyInternalsElement extends InternalsElement {
  // your own functionality goes here
}

customElements.define("a-internals", MyInternalsElement)
```

## Shadow

The **Shadow** mixin provides a configurable ShadowRoot to a custom element.

```ts
import { ShadowElement } from "@jsxtools/aui/elements/shadow"

const shadowStyles = new CSSStyleSheet()

class MyElementWithShadow extends ShadowElement {
  static shadowRootAdoptedStyleSheets = [shadowStyles]
  static shadowRootInnerHTML = "<p>shadow stuff here</p><slot></slot>"

  // your own functionality goes here
}

customElements.define("a-shadow", MyElementWithShadow)
```

## Form-Associated

The **Form-Associated** custom element provides form association and validation.

```ts
import { FormAssociatedElement } from "@jsxtools/aui/elements/form-associated"

class MyFormAssociatedElement extends FormAssociatedElement {
  // your own functionality goes here
}

customElements.define("a-form-associated", MyFormAssociatedElement)
```

## Form-Associated File

The **Form-Associated File** custom element provides file upload support with form association and validation.

```ts
import { FormAssociatedFileElement } from "@jsxtools/aui/elements/form-associated-file"

class MyFormAssociatedFileElement extends FormAssociatedFileElement {
  // your own functionality goes here
}

customElements.define("a-form-associated-file", MyFormAssociatedFileElement)
```
