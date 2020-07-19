import {createEditor} from './editor'

test('should set value', () => {
  const editor = createEditor()

  editor.apply({
    type: 'setValue',
    value: [
      {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
      {type: 'block', name: 'p', children: [{type: 'span', text: 'world'}]},
    ],
    userId: '@',
  })

  const state = editor.getState()

  expect(state.nodes).toEqual([
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'hello'},
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'world'},
  ])
  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
    {type: 'block', name: 'p', children: [{type: 'span', text: 'world'}]},
  ])
})

test('should select', () => {
  const editor = createEditor()

  editor.apply({type: 'select', anchor: [1, 0], focus: [3, 5], userId: '@'})

  const state = editor.getState()

  expect(state.selections).toEqual({
    '@': {anchor: [1, 0], focus: [3, 5]},
  })
})

test('should delete', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
        {type: 'block', name: 'p', children: [{type: 'span', text: 'world'}]},
      ],
      userId: '@',
    },
    {type: 'select', anchor: [1, 5], focus: [3, 0], userId: '@'},
    {type: 'delete', userId: '@'}
  )

  const state = editor.getState()

  expect(state.nodes).toEqual([
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'helloworld'},
  ])
  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'helloworld'}]},
  ])
  expect(state.selections).toEqual({
    '@': {anchor: [1, 5], focus: [1, 5]},
  })
})

test('should delete (reverse selection)', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
        {type: 'block', name: 'p', children: [{type: 'span', text: 'world'}]},
      ],
      userId: '@',
    },
    {type: 'select', anchor: [3, 0], focus: [1, 5], userId: '@'},
    {type: 'delete', userId: '@'}
  )

  const state = editor.getState()

  expect(state.nodes).toEqual([
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'helloworld'},
  ])
  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'helloworld'}]},
  ])
  expect(state.selections).toEqual({
    '@': {anchor: [1, 5], focus: [1, 5]},
  })
})

test('should delete (complex)', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
        {
          type: 'block',
          name: 'ul',
          children: [{type: 'block', name: 'li', children: [{type: 'span', text: 'world'}]}],
        },
      ],
      userId: '@',
    },
    {type: 'select', anchor: [1, 5], focus: [4, 0], userId: '@'},
    {type: 'delete', userId: '@'}
  )

  const state = editor.getState()

  expect(state.nodes).toEqual([
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'helloworld'},
  ])
  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'helloworld'}]},
  ])
  expect(state.selections).toEqual({
    '@': {anchor: [1, 5], focus: [1, 5]},
  })
})

test('should delete and keep (complex)', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
        {
          type: 'block',
          name: 'ul',
          children: [
            {type: 'block', name: 'li', children: [{type: 'span', text: 'world'}]},
            {type: 'block', name: 'li', children: [{type: 'span', text: 'foo'}]},
          ],
        },
      ],
      userId: '@',
    },
    {type: 'select', anchor: [1, 5], focus: [4, 0], userId: '@'},
    {type: 'delete', userId: '@'}
  )

  const state = editor.getState()

  expect(state.nodes).toEqual([
    {type: 'block', name: 'p', data: {}, depth: 0, size: 1},
    {type: 'span', data: {}, depth: 1, size: 0, text: 'helloworld'},
    {type: 'block', name: 'ul', data: {}, depth: 0, size: 2},
    {type: 'block', name: 'li', data: {}, depth: 1, size: 1},
    {type: 'span', data: {}, depth: 2, size: 0, text: 'foo'},
  ])
  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'helloworld'}]},
    {
      type: 'block',
      name: 'ul',
      children: [{type: 'block', name: 'li', children: [{type: 'span', text: 'foo'}]}],
    },
  ])
  expect(state.selections).toEqual({
    '@': {anchor: [1, 5], focus: [1, 5]},
  })
})

test('should insert text', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]},
        {
          type: 'block',
          name: 'ul',
          children: [
            {type: 'block', name: 'li', children: [{type: 'span', text: 'world'}]},
            {type: 'block', name: 'li', children: [{type: 'span', text: 'foo'}]},
          ],
        },
      ],
      userId: '@',
    },
    {type: 'select', anchor: [1, 5], focus: [4, 0], userId: '@'},
    {type: 'delete', userId: '@'},
    {type: 'insertText', data: ', ', userId: '@'}
  )

  const state = editor.getState()

  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'hello, world'}]},
    {
      type: 'block',
      name: 'ul',
      children: [{type: 'block', name: 'li', children: [{type: 'span', text: 'foo'}]}],
    },
  ])
  expect(state.selections).toEqual({
    '@': {anchor: [1, 7], focus: [1, 7]},
  })
})

test('should insert block', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [{type: 'block', name: 'p', children: [{type: 'span', text: 'hello'}]}],
      userId: '@',
    },
    {type: 'select', anchor: [1, 2], focus: [1, 3], userId: '@'},
    {type: 'delete', userId: '@'},
    {type: 'insertBlock', userId: '@'}
  )

  const state = editor.getState()

  expect(state.value).toEqual([
    {type: 'block', name: 'p', children: [{type: 'span', text: 'he'}]},
    {type: 'block', name: 'p', children: [{type: 'span', text: 'lo'}]},
  ])
})
