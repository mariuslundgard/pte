import {SelectionMap} from 'pte'
import {useMemo} from 'react'

const EMPTY_SELECTIONS: SelectionMap = {}

export function useBlockSelections(
  keys: string[],
  selectionsProp: SelectionMap,
  nodeOffset: number,
  nodeSize: number
): SelectionMap {
  const startOffset = nodeOffset
  const endOffset = nodeOffset + nodeSize

  return useMemo(() => {
    const entries = Object.entries(selectionsProp)
    const ret: SelectionMap = {}

    let match = false

    for (const [userId, sel] of entries) {
      if (sel) {
        const anchorOffset = keys.indexOf(sel.anchor[0])
        const focusOffset = keys.indexOf(sel.focus[0])

        const startOffsetInSelection = anchorOffset <= startOffset && focusOffset >= startOffset
        const endOffsetInSelection = anchorOffset <= endOffset && focusOffset >= endOffset

        if (startOffsetInSelection || endOffsetInSelection) {
          ret[userId] = sel
          match = true
        }
      }
    }

    if (!match) return EMPTY_SELECTIONS

    return ret
  }, [keys, selectionsProp, startOffset, endOffset])
}
