import {element as h} from 'hypp'
// import {getDOMNodeAtOffset} from './helpers'

test('should find DOM node at offset', () => {
  const el = h('div', h('div', {'data-offset': 0}))

  console.log(el)
})
