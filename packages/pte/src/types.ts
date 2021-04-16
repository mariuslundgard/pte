export interface PTBlock {
  type: 'block'
  name: string
  children: PTNode[]
  [key: string]: unknown
}

export interface PTSpan {
  type: 'span'
  text: string
  [key: string]: unknown
}

export type PTNode = PTBlock | PTSpan

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

export interface PTSelection {
  anchor: Location
  focus: Location
}

export interface SelectionMap {
  [userId: string]: PTSelection | undefined
}

export interface State {
  value: PTNode[]
  nodes: NodeMetadata[]
  selections: SelectionMap
}

export interface SetValueOp {
  type: 'setValue'
  value: PTNode[]
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

export type PTOp =
  | SetValueOp
  | SelectOp
  | UnsetSelectionOp
  | DeleteOp
  | InsertTextOp
  | InsertBlockOp

export type Subscriber = (state: State) => void

export interface PTEditor {
  apply: (...ops: PTOp[]) => void
  destroy: () => void
  getState: () => State
  setValue: (value: PTNode[]) => void
}
