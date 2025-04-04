# React Components

A collection of unstyled React components for building accessible web applications.

- **[Click](#click)**: A component that provides keyboard-accessible click support.
- **[Drop](#drop)**: A component that provides drag-and-drop support with visual state feedback.
- **[File](#file)**: A component that provides file picker and file drop support with visual state feedback.
- **[Internals](#internals)**: A component that provides the ElementInternals API.
- **[Form-Associated](#form-associated)**: A component that provides form association and validation support.
- **[Form-Associated File](#form-associated-file)**: A component that provides file upload support with form association and validation.

## Click

The **Click** component provides keyboard-accessible click support.

```tsx
import { ClickComponent } from "@jsxtools/aui/react/click"

export default function App() {
  return (
    <ClickComponent>I can be clicked with keyboard.</ClickComponent>
  )
}
```

## Drop

The **Drop** component provides drop support.

```tsx
import { DropComponent } from "@jsxtools/aui/react/drop"

export default function App() {
  return (
    <DropComponent>I can receive drops.</DropComponent>
  )
}
```

When a potential drop enters the component, the `dropenter` event is fired. When a potential drop leaves the component or is dropped on the component, the `dropleave` event is fired.

While an potential drop enters the component, the `:state(active-drop)` pseudo class will be applied to the component.

## File

The **File** component provides file picker and file drop support.

```tsx
import { FileComponent } from "@jsxtools/aui/react/file"

export default function App() {
  return (
    <FileComponent>I can receive file drops and I can be clicked to pick a file.</FileComponent>
  )
}
```

## Internals

The **Internals** component provides the [`ElementInternals` API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals).

```tsx
import { InternalsComponent } from "@jsxtools/aui/react/internals"

export default function App() {
  return (
    <InternalsComponent>I have element internals.</InternalsComponent>
  )
}
```

## Form-Associated

The **Form-Associated** component provides form association and validation.

```tsx
import { FormAssociatedComponent } from "@jsxtools/aui/react/form-associated"

export default function App() {
  return (
    <FormAssociatedComponent name="some-field">I submit to a form.</FormAssociatedComponent>
  )
}
```

## Form-Associated File

The **Form-Associated File** component provides file upload support with form association and validation.

```tsx
import { FormAssociatedFileComponent } from "@jsxtools/aui/react/form-associated-file"

export default function App() {
  return (
    <FormAssociatedFileComponent name="some-file-field">I accept files and submit to a form.</FormAssociatedFileComponent>
  )
}
```
