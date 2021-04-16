/** @jsx h */

import {element as h} from 'hypp'
import {getDOMNodeAtOffset} from './helpers'

test('should find DOM node at offset', () => {
  const span1 = (
    <span data-type="text" data-offset="1" data-chunk-offset="0" data-chunk-length="4">
      Test
    </span>
  )

  const span3_0 = (
    <span data-type="text" data-offset="3" data-chunk-offset="0" data-chunk-length="3">
      Hel
    </span>
  )

  const span3_1 = (
    <span data-type="text" data-offset="3" data-chunk-offset="3" data-chunk-length="0" />
  )

  const el = (
    <div contentEditable="true">
      <p data-offset="0">{span1}</p>
      <p data-offset="2">
        {span3_0}
        {span3_1}
        <span data-type="text" data-offset="3" data-chunk-offset="3" data-chunk-length="9">
          lo, world
        </span>
      </p>
    </div>
  )

  expect(getDOMNodeAtOffset(el, [1, 0])[0]).toBe(span1)
  expect(getDOMNodeAtOffset(el, [1, 3])[0]).toBe(span1)
  expect(getDOMNodeAtOffset(el, [1, 4])[0]).toBe(span1)
  // expect(getDOMNodeAtOffset(el, [3, 3])[0]).toBe(span3)
})
