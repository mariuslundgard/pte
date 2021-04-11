import {buildTree, isCollapsed, sortSelection} from '../helpers'
import {InsertBlockOp, NodeMetadata, State} from '../types'

export function insertBlock(state: State, op: InsertBlockOp): State {
  const sel = state.selections[op.userId]

  if (!sel) {
    console.warn('no selection')

    return state
  }

  if (!isCollapsed(sel)) {
    console.warn('not collapsed')

    return state
  }

  const [pos] = sortSelection(sel)

  const nodes: NodeMetadata[] = []

  let offset = state.nodes.length - 1

  const anchorNode = state.nodes[pos[0]]

  while (offset > -1) {
    let node = state.nodes[offset]

    if (offset > pos[0]) {
      nodes.unshift(node)
    }

    if (offset === pos[0]) {
      if (anchorNode.type !== 'span') {
        throw new Error('expected span node')
      }

      // duplicate
      nodes.unshift({...anchorNode, text: anchorNode.text.slice(pos[1])})

      // find closest block
      offset -= 1
      node = state.nodes[offset]

      // add anchor's block node
      nodes.unshift(node)

      // add anchor node
      nodes.unshift({...anchorNode, text: anchorNode.text.slice(0, pos[1])})
    }

    if (offset < pos[0]) {
      nodes.unshift(node)
    }

    offset -= 1
  }

  return {
    ...state,
    nodes,
    selections: {
      ...state.selections,
      [op.userId]: {
        anchor: [pos[0] + 2, 0],
        focus: [pos[0] + 2, 0],
      },
    },
    value: buildTree(nodes),
  }
}
