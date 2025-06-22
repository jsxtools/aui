/// <reference types="show-open-file-picker/polyfill" />

export const showOpenFilePicker = globalThis.showOpenFilePicker || (() => Promise.resolve([]))
