import {PTBlock, getNodeSize, PTNode, SelectionMap} from 'pte'
import React, {createElement, memo} from 'react'
import {Features} from '../types'
import {Block, RenderBlockFn} from './block'
import {Span} from './span'

export interface ChildrenProps {
  features: Features
  keys: string[]
  nodes: PTNode[]
  offset?: number
  renderBlock?: RenderBlockFn
  selections: SelectionMap
}

function defaultRenderBlock(
  node: PTBlock,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
): React.ReactElement {
  return createElement(node.name || 'div', props, children)
}

export const Children = memo(function Children(props: ChildrenProps) {
  const {
    features,
    keys,
    nodes,
    offset: offsetProp = 0,
    renderBlock = defaultRenderBlock,
    selections,
  } = props
  const children: React.ReactElement[] = []

  let offset = offsetProp

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.type === 'span') {
      children.push(
        <Span
          features={features}
          key={node.key}
          keys={keys}
          node={node}
          nodeOffset={offset}
          selections={selections}
        />
      )

      offset += 1
    } else {
      const nodeSize = getNodeSize(node)

      children.push(
        <Block
          features={features}
          key={node.key}
          keys={keys}
          node={node}
          nodeOffset={offset}
          nodeSize={nodeSize}
          renderBlock={renderBlock}
          selections={selections}
        />
      )

      offset += getNodeSize(node) + 1
    }
  }

  return <>{children}</>
})
