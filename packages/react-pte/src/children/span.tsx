import {SelectionMap, PTSpan} from 'pte'
import React, {memo, useMemo} from 'react'
import {getUserChunks} from '../getUserChunks'
import {Features} from '../types'

export interface SpanProps {
  features: Features
  node: PTSpan
  nodeOffset: number
  selections: SelectionMap
}

export const Span = memo(function Span(props: SpanProps) {
  const {features, node, nodeOffset, selections} = props
  const text = node.text
  const currTextLength = text.length

  const userChunks = useMemo(() => getUserChunks(selections, nodeOffset, node.text), [
    node,
    nodeOffset,
    selections,
  ])

  return useMemo(() => {
    let chunkOffset = 0

    if (!features.userSelection) {
      return (
        <span
          dangerouslySetInnerHTML={{__html: node.text === '' ? '<br>' : node.text}}
          data-text=""
          data-key={node.key}
          data-offset={nodeOffset}
          data-chunk-offset={0}
          data-chunk-length={node.text.length}
        />
      )
    }

    return (
      <>
        {userChunks.map((chunk, chunkIndex) => {
          if (chunk.type === 'cursor') {
            return <span data-cursor="" data-users={chunk.userIds.join(',')} key={chunkIndex} />
          }

          const currChunkOffset = chunkOffset
          const currChunkLength = chunk.text.length
          const __html = chunkIndex === 0 && currTextLength === 0 ? '<br />' : chunk.text

          chunkOffset += currChunkLength

          return (
            <span
              dangerouslySetInnerHTML={{__html}}
              data-text=""
              data-key={node.key}
              data-offset={nodeOffset}
              data-users={chunk.userIds.join(',')}
              data-chunk-offset={currChunkOffset}
              data-chunk-length={currChunkLength}
              key={chunkIndex}
            />
          )
        })}
      </>
    )
  }, [currTextLength, features, node, nodeOffset, userChunks])
})
