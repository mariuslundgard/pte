import {buildTree} from '../helpers'
import {State, UpdateBlockOp} from '../types'

export function updateBlock(state: State, op: UpdateBlockOp): State {
  const sel = state.selections[op.userId]

  if (!sel) {
    console.warn('no selection')

    return state
  }

  const nodes = state.nodes.slice(0)

  let nodeOffset = state.keys.indexOf(sel.anchor[0])

  while (nodes[nodeOffset] && nodes[nodeOffset].type !== 'block') {
    nodeOffset -= 1
  }

  const currentBlock = nodes[nodeOffset]

  if (!currentBlock) {
    console.warn('block not found')

    return state
  }

  const {name, ...data} = op.data

  if (typeof name !== 'string') {
    console.warn('name is not a string')

    return state
  }

  const newBlock = {...currentBlock, name, data}

  nodes.splice(nodeOffset, 1, newBlock)

  const keys = nodes.map((n) => n.key)
  const value = buildTree(nodes)

  return {
    ...state,
    keys,
    nodes,
    value,
  }
}
