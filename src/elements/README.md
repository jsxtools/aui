# Elements

A collection of custom elements that provide special functionality:

- **[Click](#click)**: A custom element that provides keyboard-accessible click support.
- **[Drop](#drop)**: A custom element that provides drag-and-drop support with visual state feedback.
- **[File](#file)**: A custom element that provides file picker and file drop support with visual state feedback.
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

The **Drop** custom element provides drop support.

```ts
import { DropElement } from "@jsxtools/aui/elements/drop"

class MyDropElement extends DropElement {
  // your own functionality goes here

  constructor() {
    super()

    this.addEventListener("dropenter", () => {
        // do stuff when a drop enters the element
    })

    this.addEventListener("dropleave", () => {
        // do stuff when a drop enters the element
    })
  }
}

customElements.define("a-drop", MyDropElement)
```

When a potential drop enters the element, the `dropenter` event is fired. When a potential drop leaves the element or is dropped on the element, the `dropleave` event is fired.

While an potential drop enters the element, the `:state(active-drop)` pseudo class will be applied to the element.

## File

The **File** custom element provides file picker and file drop support.

```ts
import { FileElement } from "@jsxtools/aui/elements/file"

class MyFileElement extends FileElement {
  // your own functionality goes here
  // + anything you could do with DropElement

  constructor() {
    super()

    this.addEventListener("input", () => {
        // do stuff when a file (or files) are added

        for (const file of this.files) {
          console.log(file) // TransferFile, subset of File

          file.valid // boolean, validity of File based on `maxSize` & `types`
    })
  }
}

customElements.define("a-file", MyFileElement)
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
