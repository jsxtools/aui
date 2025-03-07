export const without = <T>({ ...props }: T, ...without: string[]): T => {
	for (const name of without) {
		// @ts-expect-error because the object and name are unknown
		delete props[name]
	}

	return props
}
