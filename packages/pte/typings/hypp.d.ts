declare module 'hypp' {
  export const element: (
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>,
    ...children: Node[]
  ) => HTMLElement
}
