export interface FilePickerAcceptType {
	/** A string that describes the file type. */
	description?: string

	/** An array of content types or file extensions that can be selected. */
	accept: Record<string, string[]>
}

export interface ShowOpenFilePickerOptions {
	/** A boolean that indicates whether the picker should let the user apply file type filters. By default, this is `false`. */
	excludeAcceptAllOption?: boolean

	/** An ID to be associated with the directory. If the same ID is used for another picker, it will open the same directory. */
	id?: boolean

	/** A boolean that indicates whether the user can select multiple files. By default, this is `false`. */
	multiple?: boolean

	/** A well known directory ("desktop", "downloads") or `FileSystemHandle` to open the dialog in. */
	startIn?: string | FileSystemDirectoryHandle

	/** An array of file types that can be selected. */
	types?: FilePickerAcceptType[]
}

declare global {
	function showOpenFilePicker(
		/** An object containing options that control the file picker's behavior. */
		options?: ShowOpenFilePickerOptions,
	): Promise<FileSystemFileHandle[]>
}
