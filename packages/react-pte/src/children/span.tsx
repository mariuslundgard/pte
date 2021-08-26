import {SelectionMap, PTSpan} from 'pte'
import React, {memo, useMemo} from 'react'
import {getUserChunks} from '../getUserChunks'
import {Features} from '../types'
import {Cursor} from './cursor'

export interface SpanProps {
  features: Features
  keys: string[]
  node: PTSpan
  nodeOffset: number
  selections: SelectionMap
}

export const Span = memo(function Span(props: SpanProps) {
  const {features, keys, node, nodeOffset, selections} = props
  const text = node.text
  const currTextLength = text.length
  const marks = useMemo(() => node.marks || [], [node])

  const userChunks = useMemo(() => getUserChunks(keys, selections, node.key, node.text), [
    keys,
    node,
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
            return <Cursor chunk={chunk} key={chunkIndex} />
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
              data-marks={marks.join(',')}
              data-chunk-offset={currChunkOffset}
              data-chunk-length={currChunkLength}
              key={chunkIndex}
            />
          )
        })}
      </>
    )
  }, [currTextLength, features, marks, node, nodeOffset, userChunks])
})
