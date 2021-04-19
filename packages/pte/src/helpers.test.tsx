/** @jsx h */

import {element as h} from 'hypp'
import {createMockSelection} from './__mocks__/selection.mock'
import {getDOMNodeAtOffset, getDOMSelection, setDOMSelection} from './helpers'

test('should find DOM node at offset', () => {
  const span1_0 = (
    <span data-text data-key="1" data-chunk-offset="0" data-chunk-length="4">
      Test
    </span>
  )

  const span3_0 = (
    <span data-text data-key="3" data-chunk-offset="0" data-chunk-length="3">
      Hel
    </span>
  )
  const span3_1 = (
    <span data-text data-key="3" data-chunk-offset="3" data-chunk-length="9">
      lo, world
    </span>
  )

  const el = (
    <div contentEditable="true">
      <p data-key="0">{span1_0}</p>
      <p data-key="2">
        {span3_0}
        <span data-cursor />
        {span3_1}
      </p>
    </div>
  )

  expect(getDOMNodeAtOffset(el, ['1', 0]).node).toBe(span1_0)
  expect(getDOMNodeAtOffset(el, ['1', 3]).node).toBe(span1_0)
  expect(getDOMNodeAtOffset(el, ['1', 4]).node).toBe(span1_0)
  expect(getDOMNodeAtOffset(el, ['3', 0]).node).toBe(span3_0)
  expect(getDOMNodeAtOffset(el, ['3', 2]).node).toBe(span3_0)
  expect(getDOMNodeAtOffset(el, ['3', 3]).node).toBe(span3_1)
})

test('get and set dom selection', () => {
  const node = (
    <span data-key="1" data-chunk-offset="16" data-chunk-length="12">
      in selection
    </span>
  )

  const domSelection = createMockSelection()

  const result = setDOMSelection(domSelection, {node, offset: 0}, {node, offset: 12})

  expect(result).toBe(true)

  const sel = getDOMSelection(domSelection)

  expect(sel).toEqual({anchor: ['1', 16], focus: ['1', 28]})
})
