export interface Block {
  type: 'block'
  name: string
  children: Node[]
  [key: string]: unknown
}

export interface Span {
  type: 'span'
  text: string
  [key: string]: unknown
}

export type Node = Block | Span

export interface BlockNodeMetadata {
  type: 'block'
  name: string
  data: Record<string, unknown>
  depth: number
  size: number
}

export interface SpanNodeMetadata {
  type: 'span'
  data: Record<string, unknown>
  depth: number
  size: number
  text: string
}

export type NodeMetadata = BlockNodeMetadata | SpanNodeMetadata

export type NodePosition = number
export type TextOffset = number
export type Location = [NodePosition, TextOffset]

export interface Selection {
  anchor: Location
  focus: Location
}

export interface SelectionMap {
  [userId: string]: Selection | undefined
}

export interface State {
  value: Node[]
  nodes: NodeMetadata[]
  selections: SelectionMap
}

export interface SetValueOp {
  type: 'setValue'
  value: Node[]
  userId: string
}

export interface SelectOp {
  type: 'select'
  anchor: Location
  focus: Location
  userId: string
}

export interface UnsetSelectionOp {
  type: 'unsetSelection'
  userId: string
}

export interface DeleteOp {
  type: 'delete'
  userId: string
}

export interface InsertTextOp {
  type: 'insertText'
  data: string
  userId: string
}

export interface InsertBlockOp {
  type: 'insertBlock'
  userId: string
}

export type Op = SetValueOp | SelectOp | UnsetSelectionOp | DeleteOp | InsertTextOp | InsertBlockOp

export type Subscriber = (state: State) => void

export interface Editor {
  apply: (...ops: Op[]) => void
  destroy: () => void
  getState: () => State
  setValue: (value: Node[]) => void
}
