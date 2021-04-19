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

  const [pos] = sortSelection(state.keys, sel)

  const nodes: NodeMetadata[] = []

  let offset = state.nodes.length - 1

  // const anchorNode = state.nodes[pos[0]]
  const anchorOffset = state.keys.indexOf(pos[0])
  const anchorNode = state.nodes[anchorOffset]

  while (offset > -1) {
    let node = state.nodes[offset]

    if (offset > anchorOffset) {
      nodes.unshift(node)
    }

    if (offset === anchorOffset) {
      if (anchorNode.type !== 'span') {
        throw new Error('expected span node')
      }

      // duplicate
      nodes.unshift({
        ...anchorNode,
        key: op.spanKey,
        text: anchorNode.text.slice(pos[1]),
      })

      // find closest block
      offset -= 1
      node = state.nodes[offset]

      // add anchor's block node
      nodes.unshift({
        ...node,
        key: op.blockKey,
      })

      // add anchor node
      nodes.unshift({...anchorNode, text: anchorNode.text.slice(0, pos[1])})
    }

    if (offset < anchorOffset) {
      nodes.unshift(node)
    }

    offset -= 1
  }

  const keys = nodes.map((n) => n.key)

  return {
    ...state,
    keys,
    nodes,
    selections: {
      ...state.selections,
      [op.userId]: {
        anchor: [op.spanKey, 0],
        focus: [op.spanKey, 0],
      },
    },
    value: buildTree(nodes),
  }
}
