import {SelectionMap} from 'pte'
import {useMemo} from 'react'

const EMPTY_SELECTIONS: SelectionMap = {}

export function useBlockSelections(
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
      const startOffsetInSelection =
        sel && sel.anchor[0] <= startOffset && sel.focus[0] >= startOffset
      const endOffsetInSelection = sel && sel.anchor[0] <= endOffset && sel.focus[0] >= endOffset

      if (startOffsetInSelection || endOffsetInSelection) {
        ret[userId] = sel
        match = true
      }
    }

    if (!match) return EMPTY_SELECTIONS

    return ret
  }, [selectionsProp, startOffset, endOffset])
}
