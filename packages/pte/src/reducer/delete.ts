import {buildTree, isCollapsed, sortSelection} from '../helpers'
import {DeleteOp, NodeMetadata, SpanNodeMetadata, State} from '../types'

function findPrevSpan(nodes: NodeMetadata[], index: number): SpanNodeMetadata | null {
  let i = index - 1

  while (i > -1) {
    const n = nodes[i]

    if (n.type === 'span') {
      return n
    }

    i -= 1
  }

  return null
}

export function _delete(state: State, op: DeleteOp): State {
  const sel = state.selections[op.userId]

  if (!sel) {
    console.warn('no selection')

    return state
  }

  const [from, to] = sortSelection(state.keys, sel)
  let fromOffset = state.keys.indexOf(from[0])
  let fromTextOffset = from[1]
  const toOffset = state.keys.indexOf(to[0])
  const toTextOffset = to[1]

  // check if selection is collapsed
  if (isCollapsed(sel)) {
    if (fromTextOffset === 0) {
      if (fromOffset > 0) {
        const newFromNode = findPrevSpan(state.nodes, fromOffset)

        if (newFromNode) {
          fromOffset = state.nodes.indexOf(newFromNode)
          fromTextOffset = newFromNode.text.length
        }
      }
    } else {
      fromTextOffset -= 1
    }
  }

  // console.log('delete', JSON.stringify([from, to]))

  const fromNode = state.nodes[fromOffset]
  const toNode = state.nodes[toOffset]

  if (fromNode.type !== 'span' || toNode.type !== 'span') {
    return state
  }

  const nodes: NodeMetadata[] = []
  const len = state.nodes.length
  let offset = len - 1

  // @todo: use `push` instead of `unshift`
  while (offset > -1) {
    let node = state.nodes[offset]

    if (offset < fromOffset || offset > toOffset) {
      // keep nodes that are not selected
      nodes.unshift(node)
    } else if (offset === toOffset) {
      // found focus node

      let removedSize = 1

      // traverse backwards until there's no immediate parent node
      while (offset !== fromOffset) {
        offset -= 1

        const prevNode = node

        node = state.nodes[offset]

        if (node.depth < prevNode.depth) {
          if (node.size > removedSize) {
            nodes.unshift({...node, size: node.size - removedSize})
          } else {
            removedSize += 1
          }
        } else if (node.depth > prevNode.depth) {
          // skip to end
          offset = fromOffset
        }
      }

      // replace the selected text node
      nodes.unshift({
        ...fromNode,
        text: fromNode.text.slice(0, fromTextOffset) + toNode.text.slice(toTextOffset),
      })
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
        anchor: [state.keys[fromOffset], fromTextOffset],
        focus: [state.keys[fromOffset], fromTextOffset],
      },
    },
    value: buildTree(nodes),
  }
}
