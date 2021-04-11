import {buildTree, isCollapsed} from '../helpers'
import {InsertTextOp, SelectionMap, State} from '../types'

export function insertText(state: State, op: InsertTextOp): State {
  const sel = state.selections[op.userId]

  if (!sel) {
    console.warn('no selection')

    return state
  }

  if (!isCollapsed(sel)) {
    return state
  }

  const anchorNode = state.nodes[sel.anchor[0]]

  if (anchorNode.type !== 'span') {
    return state
  }

  const nodes = state.nodes.map((node, offset) => {
    if (offset === sel.anchor[0]) {
      const text =
        anchorNode.text.slice(0, sel.anchor[1]) + op.data + anchorNode.text.slice(sel.focus[1])

      return {
        ...anchorNode,
        text,
      }
    }

    return node
  })

  const selections: SelectionMap = {
    ...state.selections,
    [op.userId]: {
      anchor: [sel.anchor[0], sel.anchor[1] + op.data.length],
      focus: [sel.anchor[0], sel.anchor[1] + op.data.length],
    },
  }

  return {
    ...state,
    nodes,
    selections,
    value: buildTree(nodes),
  }
}
