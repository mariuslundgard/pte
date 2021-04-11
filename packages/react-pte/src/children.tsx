import {Block as BlockType, getNodeSize, Node, SelectionMap, Span as SpanType} from 'pte'
import React, {createElement, memo, useEffect} from 'react'
import {getTextChunks, getNodeSelections} from './helpers'

function defaultRenderBlock(
  node: BlockType,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
): React.ReactElement {
  return createElement(node.name || 'div', props, children)
}

export function Children(props: {
  nodes: Node[]
  offset?: number
  renderBlock?: (
    node: BlockType,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  selections: SelectionMap
}): React.ReactElement {
  const {nodes, offset: offsetProp = 0, renderBlock = defaultRenderBlock, selections} = props
  const children: React.ReactElement[] = []

  let offset = offsetProp

  useEffect(() => console.log('Children.nodes'), [nodes])
  useEffect(() => console.log('Children.renderBlock'), [renderBlock])
  useEffect(() => console.log('Children.offset'), [offset])

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.type === 'span') {
      children.push(<Span key={i} node={node} nodeOffset={offset} selections={selections} />)

      offset += 1
    } else {
      children.push(
        <Block
          key={i}
          node={node}
          nodeOffset={offset}
          renderBlock={renderBlock}
          selections={selections}
        />
      )

      offset += getNodeSize(node) + 1
    }
  }

  return <>{children}</>
}

const Span = memo(function Span({
  node,
  nodeOffset,
  selections,
}: {
  node: SpanType
  nodeOffset: number
  selections: SelectionMap
}) {
  const currTextLength = node.text.length
  const nodeSelections = getNodeSelections(selections, nodeOffset, node.text)
  const chunks = getTextChunks(nodeSelections, node.text)

  let textOffset = 0

  useEffect(() => console.log('Span.node'), [node])
  useEffect(() => console.log('Span.nodeOffset'), [nodeOffset])
  useEffect(() => console.log('Span.selections'), [selections])

  return (
    <span data-type="span" data-offset={nodeOffset}>
      {chunks.map((chunk, chunkIndex) => {
        const currTextOffset = textOffset
        const currChunkLength = chunk.text.length
        let __html = chunk.text ? chunk.text.replace(/\s/g, '&nbsp;') : ''

        if (chunkIndex === 0 && currTextLength === 0) {
          __html = '<br>'
        }

        textOffset += currChunkLength

        return (
          <span
            dangerouslySetInnerHTML={{__html}}
            data-type="text"
            data-chunk={chunkIndex}
            data-chunk-offset={currTextOffset}
            data-chunk-length={currChunkLength}
            data-offset={nodeOffset}
            data-users={chunk.users.join(',')}
            key={chunkIndex}
          />
        )
      })}
    </span>
  )
})

const Block = memo(function Block({
  node,
  nodeOffset,
  renderBlock,
  selections,
}: {
  node: BlockType
  nodeOffset: number
  renderBlock: (
    node: BlockType,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  selections: SelectionMap
}) {
  useEffect(() => console.log('Block.node'), [node])
  useEffect(() => console.log('Block.nodeOffset'), [nodeOffset])
  useEffect(() => console.log('Block.renderBlock'), [renderBlock])
  useEffect(() => console.log('Block.selections'), [selections])

  return renderBlock(
    node,
    {
      'data-type': 'block',
      'data-offset': String(nodeOffset),
    },
    <Children
      nodes={node.children}
      offset={nodeOffset + 1}
      renderBlock={renderBlock}
      selections={selections}
    />
  )
})
