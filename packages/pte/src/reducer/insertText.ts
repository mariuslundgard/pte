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

  const anchorOffset = state.keys.indexOf(sel.anchor[0])
  const anchorNode = state.nodes[anchorOffset]

  if (anchorNode.type !== 'span') {
    return state
  }

  const nodes = state.nodes.slice(0)

  const newTextNode = {
    ...anchorNode,
    text: anchorNode.text.slice(0, sel.anchor[1]) + op.data + anchorNode.text.slice(sel.focus[1]),
  }

  nodes.splice(anchorOffset, 1, newTextNode)

  // const nodes = state.nodes.map((node, offset) => {
  //   if (offset === anchorOffset) {
  //     const text =
  //       anchorNode.text.slice(0, sel.anchor[1]) + op.data + anchorNode.text.slice(sel.focus[1])

  //     return {
  //       ...anchorNode,
  //       text,
  //     }
  //   }

  //   return node
  // })

  const selections: SelectionMap = {
    ...state.selections,
    [op.userId]: {
      anchor: [sel.anchor[0], sel.anchor[1] + op.data.length],
      focus: [sel.anchor[0], sel.anchor[1] + op.data.length],
    },
  }

  // const keys = nodes.map((n) => n.key)

  return {
    ...state,
    // keys,
    nodes,
    selections,
    value: buildTree(nodes),
  }
}
