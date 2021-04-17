import {PTBlock, SelectionMap} from 'pte'
import React, {memo} from 'react'
import {Features} from '../types'
import {Children} from './children'
import {useBlockSelections} from './useBlockSelections'

export type RenderBlockFn = (
  node: PTBlock,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
) => React.ReactElement

export interface BlockProps {
  features: Features
  node: PTBlock
  nodeOffset: number
  nodeSize: number
  renderBlock: RenderBlockFn
  selections: SelectionMap
}

export const Block = memo(function Block(props: BlockProps) {
  const {features, node, nodeOffset, nodeSize, renderBlock, selections: selectionsProp} = props
  const selections = useBlockSelections(selectionsProp, nodeOffset, nodeSize)

  return renderBlock(
    node,
    {
      'data-block': '',
      'data-key': node.key,
      'data-offset': String(nodeOffset),
      'data-size': String(nodeSize),
    },
    <Children
      features={features}
      nodes={node.children}
      offset={nodeOffset + 1}
      renderBlock={renderBlock}
      selections={selections}
    />
  )
})
