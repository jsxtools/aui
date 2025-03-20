# Mixins

A collection of reusable mixins to enhance custom elements with additional functionality:

- **[Click](#click)**: A mixin that provides keyboard-accessible click support to a custom element.
- **[Drop](#drop)**: A mixin that provides drag-and-drop support with visual state feedback to a custom element.
- **[Internals](#internals)**: A mixin that provides the ElementInternals API to a custom element.
- **[Shadow](#shadow)**: A mixin that provides a configurable ShadowRoot to a custom element.
- **[FormAssociated](#form-associated)**: A mixin that provides form association and validation support to a custom element.
- **[FormAssociatedFile](#form-associated-file)**: A mixin that provides file upload support with form association and validation to a custom element.

## Click

The **Click** mixin provides keyboard-accessible click support to a custom element.

```ts
import { ClickMixin } from "@jsxtools/aui/mixins/click"

class MyElementWithClickability extends ClickMixin(HTMLElement) {
  // your own functionality goes here
}
```

## Drop

The **Drop** mixin provides drop support to a custom element.

```ts
import { DropMixin } from "@jsxtools/aui/mixins/drop"

class MyElementWitDragAndDrop extends DropMixin(HTMLElement) {
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
```

When a potential drop enters the element, the `dropenter` event is fired. When a potential drop leaves the element or is dropped on the element, the `dropleave` event is fired.

While an potential drop enters the element, the `:state(active-drop)` pseudo class will be applied to the element.

## Internals

The **Internals** mixin provides the [`ElementInternals` API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) to a custom element.

```ts
import { InternalsMixin } from "@jsxtools/aui/mixins/internals"

class MyElementWithInternals extends InternalsMixin(HTMLElement) {
  // your own functionality goes here
}
```

## Shadow

The **Shadow** mixin provides a configurable ShadowRoot to a custom element.

```ts
import { ShadowMixin } from "@jsxtools/aui/mixins/shadow"

const shadowStyles = new CSSStyleSheet()

class MyElementWithShadow extends ShadowMixin(HTMLElement) {
  static shadowRootAdoptedStyleSheets = [shadowStyles]
  static shadowRootInnerHTML = "<p>shadow stuff here</p><slot></slot>"

  // your own functionality goes here
}
```

## Form-Associated

The **Form-Associated** mixin provides form association and validation to a custom element.

```ts
import { FormAssociatedMixin } from "@jsxtools/aui/mixins/form-associated"

class MyFormControlElement extends FormAssociatedMixin(HTMLElement) {
  // your own functionality goes here
}
```

## Form-Associated File

The **Form-Associated File** mixin provides file upload support with form association and validation to a custom element.

```ts
import { FormAssociatedFileMixin } from "@jsxtools/aui/mixins/form-associated-file"

class MyFormControlFileElement extends FormAssociatedFileMixin(HTMLElement) {
  // your own functionality goes here
}
```
