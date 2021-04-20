export type PTNodeKey = string

export interface PTBlock {
  type: 'block'
  key: PTNodeKey
  name: string
  children: PTNode[]
  [key: string]: unknown
}

export interface PTSpan {
  type: 'span'
  key: PTNodeKey
  text: string
  marks?: string[]
  [key: string]: unknown
}

export type PTNode = PTBlock | PTSpan

export interface BlockNodeMetadata {
  type: 'block'
  name: string
  data: Record<string, unknown>
  depth: number
  size: number
  key: PTNodeKey
}

export interface SpanNodeMetadata {
  type: 'span'
  data: Record<string, unknown>
  depth: number
  marks?: string[]
  size: number
  text: string
  key: string
}

export type NodeMetadata = BlockNodeMetadata | SpanNodeMetadata

export type NodePosition = number
export type TextOffset = number
export type Location = [PTNodeKey, TextOffset]

export interface PTSelection {
  anchor: Location
  focus: Location
}

export interface SelectionMap {
  [userId: string]: PTSelection | undefined
}

export interface State {
  keys: PTNodeKey[]
  nodes: NodeMetadata[]
  selections: SelectionMap
  value: PTNode[]
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
  spanKey: string
  blockKey: string
}

export interface ToggleMarkOp {
  type: 'toggleMark'
  name: string
  userId: string
}

export interface UpdateBlockOp {
  type: 'updateBlock'
  data: Record<string, unknown>
  userId: string
}

export type PTOp =
  | SetValueOp
  | SelectOp
  | UnsetSelectionOp
  | DeleteOp
  | InsertTextOp
  | InsertBlockOp
  | UpdateBlockOp
  | ToggleMarkOp

export type Subscriber = (state: State) => void

export interface PTEditor {
  apply: (...ops: PTOp[]) => void
  destroy: () => void
  getState: () => State
  setValue: (value: PTNode[]) => void
  toggleMark: (markName: string) => void
  updateDOMSelection: () => void
  updateBlock: (data: Record<string, unknown>) => void
}
