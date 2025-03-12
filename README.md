# AUI

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]

**AUI** is a collection of mixins, custom elements, and framework exports that enable you to build accessible and reusable components in whatever development environment you prefer.

## Features

- 🎨 **TypeScript Support**: Full type safety and autocompletion
- ⚡ **Performance Optimized**: Efficient updates and rendering
- 🚀 **Zero Dependencies**: Lightweight and framework-agnostic
- 🎯 **React Exports**: Every custom element is available as a React component
- 📦 **Tree-shakeable**: Only import what you need

## Installation

```shell
npm install @jsxtools/aui
```

## React Usage

```tsx
import { FileAssociatedComponent } from "@jsxtools/aui/react/file-associated"

// <FileAssociatedComponent> is an unstyled react component
// drag & drop ready
// click-to-upload ready
// and form-submittable
export default function App() {
  return (
    <form>
      <FileAssociatedComponent name="file" />
    </form>
  )
}
```

## Custom Element Usage

```ts
import { FileAssociatedElement } from "@jsxtools/aui/elements/file-associated"

// <file-associated> is an unstyled custom element
// drag & drop ready
// click-to-upload ready
// and form-submittable
customElements.define("file-associated", FileAssociatedElement)
```

## Mixin Usage

```ts
import { mixinFileAssociated } from "@jsxtools/aui/mixins/file-associated"

// make it your own thing
export class FileAssociatedElement extends mixinFileAssociated(HTMLElement) {
  // add whatever extra functionality you want here
}
```

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b your/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin your/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT No Attribution License](https://opensource.org/license/mit-0).

[npm-img]: https://img.shields.io/npm/v/@jsxtools/aui
[npm-url]: https://www.npmjs.com/package/@jsxtools/aui
[cli-img]: https://github.com/jsxtools/aui/workflows/test/badge.svg
[cli-url]: https://github.com/jsxtools/aui/actions
