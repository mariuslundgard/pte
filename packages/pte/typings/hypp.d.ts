declare module 'hypp' {
  export const element: (
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>,
    ...children: Array<Node | string>
  ) => HTMLElement
}

declare namespace JSX {
  interface Element extends HTMLElement {}
}
