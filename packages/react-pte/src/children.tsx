import {Block, getNodeSize, Node, SelectionMap} from 'pte'
import React, {createElement} from 'react'
import {getTextChunks, getNodeSelections} from './helpers'

function defaultRenderBlock(
  node: Block,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
): React.ReactElement {
  return createElement(node.name || 'div', props, children)
}

export function Children(props: {
  nodes: Node[]
  offset?: number
  renderBlock?: (
    node: Block,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  selections: SelectionMap
}): React.ReactElement {
  const {renderBlock = defaultRenderBlock, selections} = props

  let offset = props.offset || 0

  return (
    <>
      {props.nodes.map((node, index) => {
        const nodeOffset = offset

        offset += 1

        if (node.type === 'span') {
          const currTextLength = node.text.length
          const nodeSelections = getNodeSelections(selections, nodeOffset, node.text)
          const chunks = getTextChunks(nodeSelections, node.text)

          let textOffset = 0

          return (
            <span data-type="span" data-offset={nodeOffset} key={index}>
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
        }

        offset += getNodeSize(node)

        return renderBlock(
          node,
          {
            'data-type': 'block',
            'data-offset': String(nodeOffset),
            key: index,
          },
          <Children
            nodes={node.children}
            offset={nodeOffset + 1}
            renderBlock={renderBlock}
            selections={selections}
          />
        )
      })}
    </>
  )
}
