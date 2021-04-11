import {SelectionMap, sortSelection} from 'pte'

export interface TextSelection {
  start: number
  stop: number
  userId: string
}

export interface TextChunk {
  text: string
  users: string[]
}

/**
 * Return array of selections of a given node
 */
export function getNodeSelections(
  selections: SelectionMap,
  nodeOffset: number,
  text: string
): TextSelection[] {
  const ret: TextSelection[] = []
  const entries = Object.entries(selections)

  for (const [userId, sel] of entries) {
    if (!sel) {
      continue
    }

    const [from, to] = sortSelection(sel)

    if (from[0] <= nodeOffset && nodeOffset <= to[0]) {
      const start = from[0] === nodeOffset ? from[1] : 0
      const stop = to[0] === nodeOffset ? to[1] : text.length

      ret.push({start, stop, userId})
    }
  }

  return ret
}

/**
 * Return array of user ids (strings) for users that have made selections in the given range (from -> to)
 */
function getSelectorsInRange(selections: TextSelection[], fromIndex: number, toIndex: number) {
  const ret: string[] = []

  for (const sel of selections) {
    if (sel.start === sel.stop && fromIndex !== toIndex) {
      // no match
      continue
    }

    if (fromIndex == sel.start || sel.stop === toIndex) {
      ret.push(sel.userId)
    }
  }

  return ret
}

export function getTextChunks(nodeSelections: TextSelection[], text: string): TextChunk[] {
  if (nodeSelections.length === 0) {
    return [{text, users: []}]
  }

  const ret = []

  const indexes = nodeSelections.reduce(
    (acc: number[], x) => {
      if (!acc.includes(x.start)) acc.push(x.start)
      if (!acc.includes(x.stop)) acc.push(x.stop)

      return acc
    },
    [0, text.length]
  )

  indexes.sort((a, b) => a - b)

  for (let i = 0; i < indexes.length - 1; i += 1) {
    const fromIndex = indexes[i]
    const toIndex = indexes[i + 1]

    const collapsedFrom = getSelectorsInRange(nodeSelections, fromIndex, fromIndex)

    if (collapsedFrom.length) {
      ret.push({
        text: '',
        users: collapsedFrom,
      })
    }

    ret.push({
      text: text.slice(fromIndex, toIndex),
      users: getSelectorsInRange(nodeSelections, fromIndex, toIndex),
    })
  }

  const collapsedTo = getSelectorsInRange(
    nodeSelections,
    indexes[indexes.length - 1],
    indexes[indexes.length - 1]
  )

  if (collapsedTo.length) {
    ret.push({
      text: '',
      users: collapsedTo,
    })
  }

  return ret
}
