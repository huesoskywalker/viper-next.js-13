export type Alias<T> = {
    [K in keyof T]: `@\${string & T[K]}`
}
