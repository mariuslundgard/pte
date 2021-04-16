import {PTBlock, getNodeSize, PTNode, SelectionMap} from 'pte'
import React, {createElement} from 'react'
import {Block} from './block'
import {Span} from './span'

function defaultRenderBlock(
  node: PTBlock,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
): React.ReactElement {
  return createElement(node.name || 'div', props, children)
}

export function Children(props: {
  nodes: PTNode[]
  offset?: number
  renderBlock?: (
    node: PTBlock,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  selections: SelectionMap
}): React.ReactElement {
  const {nodes, offset: offsetProp = 0, renderBlock = defaultRenderBlock, selections} = props
  const children: React.ReactElement[] = []

  let offset = offsetProp

  // useEffect(() => console.log('Children.nodes'), [nodes])
  // useEffect(() => console.log('Children.renderBlock'), [renderBlock])
  // useEffect(() => console.log('Children.offset'), [offset])

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.type === 'span') {
      children.push(<Span key={i} node={node} nodeOffset={offset} selections={selections} />)

      offset += 1
    } else {
      const nodeSize = getNodeSize(node)

      children.push(
        <Block
          key={i}
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
}
