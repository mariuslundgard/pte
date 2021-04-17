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

  const [from, to] = sortSelection(sel)

  // check if selection is collapsed
  if (isCollapsed(sel)) {
    if (from[1] === 0) {
      if (from[0] > 0) {
        const newFromNode = findPrevSpan(state.nodes, from[0])

        if (newFromNode) {
          from[0] = state.nodes.indexOf(newFromNode)
          from[1] = newFromNode.text.length
        }
      }
    } else {
      from[1] -= 1
    }
  }

  // console.log('delete', JSON.stringify([from, to]))

  const fromNode = state.nodes[from[0]]
  const toNode = state.nodes[to[0]]

  if (fromNode.type !== 'span' || toNode.type !== 'span') {
    return state
  }

  const nodes: NodeMetadata[] = []
  const len = state.nodes.length
  let offset = len - 1

  // @todo: use `push` instead of `unshift`
  while (offset > -1) {
    let node = state.nodes[offset]

    if (offset < from[0] || offset > to[0]) {
      // keep nodes that are not selected
      nodes.unshift(node)
    } else if (offset === to[0]) {
      // found focus node

      let removedSize = 1

      // traverse backwards until there's no immediate parent node
      while (offset !== from[0]) {
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
          offset = from[0]
        }
      }

      // replace the selected text node
      nodes.unshift({
        ...fromNode,
        text: fromNode.text.slice(0, from[1]) + toNode.text.slice(to[1]),
      })
    }

    offset -= 1
  }

  return {
    ...state,
    nodes,
    selections: {
      ...state.selections,
      [op.userId]: {
        anchor: [from[0], from[1]],
        focus: [from[0], from[1]],
      },
    },
    value: buildTree(nodes),
  }
}
