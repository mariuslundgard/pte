import {PTBlock, SelectionMap} from 'pte'
import React, {memo, useMemo} from 'react'
import {Children} from './children'

const EMPTY_SELECTIONS: SelectionMap = {}

function useBlockSelections(selectionsProp: SelectionMap, nodeOffset: number, nodeSize: number) {
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

export const Block = memo(function Block({
  node,
  nodeOffset,
  nodeSize,
  renderBlock,
  selections: selectionsProp,
}: {
  node: PTBlock
  nodeOffset: number
  nodeSize: number
  renderBlock: (
    node: PTBlock,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  selections: SelectionMap
}) {
  const selections = useBlockSelections(selectionsProp, nodeOffset, nodeSize)

  // useEffect(() => console.log('Block.node'), [node])
  // useEffect(() => console.log('Block.nodeOffset'), [nodeOffset])
  // useEffect(() => console.log('Block.renderBlock'), [renderBlock])
  // useEffect(() => console.log('Block.selections'), [selections])

  return renderBlock(
    node,
    {
      'data-type': 'block',
      'data-offset': String(nodeOffset),
      'data-size': String(nodeSize),
    },
    <Children
      nodes={node.children}
      offset={nodeOffset + 1}
      renderBlock={renderBlock}
      selections={selections}
    />
  )
})
