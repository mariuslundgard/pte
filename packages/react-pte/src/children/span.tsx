import {SelectionMap, PTSpan} from 'pte'
import React, {useMemo} from 'react'
import {getTextChunks, getNodeSelections} from '../helpers'
import {getSpanSelections} from '../helpers'

export function Span({
  node,
  nodeOffset,
  selections: selectionsProp,
}: {
  node: PTSpan
  nodeOffset: number
  selections: SelectionMap
}): React.ReactElement {
  const text = node.text
  const currTextLength = text.length

  const selections = useMemo(() => getSpanSelections(selectionsProp, nodeOffset), [
    nodeOffset,
    selectionsProp,
  ])

  const nodeSelections = useMemo(() => getNodeSelections(selections, nodeOffset, text), [
    nodeOffset,
    selections,
    text,
  ])

  const chunks = useMemo(() => getTextChunks(nodeSelections, text), [nodeSelections, text])

  // useEffect(() => console.log('Span.text'), [text])
  // useEffect(() => console.log('Span.nodeOffset'), [nodeOffset])
  // useEffect(() => console.log('Span.selections'), [selections])

  // console.log('Span', nodeOffset, selections)

  return useMemo(() => {
    let textOffset = 0

    return (
      <>
        <span contentEditable="false" suppressContentEditableWarning>
          <code>{nodeOffset}:</code>
          <span> </span>
        </span>

        <>
          {chunks.map((chunk, chunkIndex) => {
            const currTextOffset = textOffset
            const currChunkLength = chunk.text.length
            const __html = chunkIndex === 0 && currTextLength === 0 ? '<br />' : chunk.text

            textOffset += currChunkLength

            return (
              <span
                dangerouslySetInnerHTML={{__html}}
                data-type="text"
                data-offset={nodeOffset}
                data-users={chunk.users.join(',')}
                data-chunk-offset={currTextOffset}
                data-chunk-length={currChunkLength}
                key={chunkIndex}
              />
            )
          })}
        </>
      </>
    )
  }, [chunks, currTextLength, nodeOffset])
}
