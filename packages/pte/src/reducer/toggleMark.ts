import {buildTree, createId, sortSelection} from '../helpers'
import {State, ToggleMarkOp} from '../types'

export function toggleMark(state: State, op: ToggleMarkOp): State {
  console.log('toggleMark', op)

  const sel = state.selections[op.userId]

  if (!sel) {
    console.warn('no selection')

    return state
  }

  const [from, to] = sortSelection(state.keys, sel)

  if (from[0] !== to[0]) {
    console.warn('todo: support multi-span mark toggling')

    return state
  }

  const nodes = state.nodes.slice(0)
  const fromOffset = state.keys.indexOf(from[0])
  const fromNode = state.nodes[fromOffset]

  if (!fromNode) {
    console.log(`node not found: "${from[0]}"`)

    return state
  }

  if (fromNode.type !== 'span') {
    console.warn('anchor must be a span node')

    return state
  }

  // remove current span
  nodes.splice(fromOffset, 1)

  const nextSel = {...sel}

  let ins = 0

  // before
  if (from[1] > 0) {
    nodes.splice(fromOffset + ins, 0, {
      ...fromNode,
      text: fromNode.text.slice(0, from[1]),
    })

    ins += 1
  }

  // the selected span
  if (from[1] < to[1]) {
    const spanNode = {
      ...fromNode,
      key: createId(),
      text: fromNode.text.slice(from[1], to[1]),
      marks: fromNode.marks ? fromNode.marks.concat([op.name]) : [op.name],
    }

    nodes.splice(fromOffset + ins, 0, spanNode)

    nextSel.anchor = [spanNode.key, 0]
    nextSel.focus = [spanNode.key, spanNode.text.length]

    ins += 1
  }

  // after
  if (to[1] < fromNode.text.length) {
    const spanNode = {
      ...fromNode,
      key: createId(),
      text: fromNode.text.slice(to[1]),
    }

    nodes.splice(fromOffset + ins, 0, spanNode)

    nextSel.focus = [spanNode.key, 0]

    ins += 1
  }

  return {
    ...state,
    keys: nodes.map((n) => n.key),
    nodes,
    selections: {
      ...state.selections,
      [op.userId]: nextSel,
    },
    value: buildTree(nodes),
  }
}
