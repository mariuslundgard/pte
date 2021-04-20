import {createEditor} from './editor'

// test('should set value', () => {
//   const editor = createEditor()

//   editor.apply({
//     type: 'setValue',
//     value: [
//       {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//       {type: 'block', key: '2', name: 'p', children: [{type: 'span', key: '3', text: 'world'}]},
//     ],
//     userId: '@',
//   })

//   const state = editor.getState()

//   expect(state.nodes).toEqual([
//     {type: 'block', key: '0', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '1', data: {}, depth: 1, size: 0, text: 'hello'},
//     {type: 'block', key: '2', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '3', data: {}, depth: 1, size: 0, text: 'world'},
//   ])
//   expect(state.value).toEqual([
//     {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//     {type: 'block', key: '2', name: 'p', children: [{type: 'span', key: '3', text: 'world'}]},
//   ])
// })

// test('should select', () => {
//   const editor = createEditor()

//   editor.apply({type: 'select', anchor: ['1', 0], focus: ['3', 5], userId: '@'})

//   const state = editor.getState()

//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 0], focus: ['3', 5]},
//   })
// })

// test('should delete', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//         {type: 'block', key: '2', name: 'p', children: [{type: 'span', key: '3', text: 'world'}]},
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['1', 5], focus: ['3', 0], userId: '@'},
//     {type: 'delete', userId: '@'}
//   )

//   const state = editor.getState()

//   expect(state.nodes).toEqual([
//     {type: 'block', key: '0', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '1', data: {}, depth: 1, size: 0, text: 'helloworld'},
//   ])
//   expect(state.value).toEqual([
//     {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'helloworld'}]},
//   ])
//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 5], focus: ['1', 5]},
//   })
// })

// test('should delete (reverse selection)', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//         {type: 'block', key: '2', name: 'p', children: [{type: 'span', key: '3', text: 'world'}]},
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['3', 0], focus: ['1', 5], userId: '@'},
//     {type: 'delete', userId: '@'}
//   )

//   const state = editor.getState()

//   expect(state.nodes).toEqual([
//     {type: 'block', key: '0', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '1', data: {}, depth: 1, size: 0, text: 'helloworld'},
//   ])
//   expect(state.value).toEqual([
//     {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'helloworld'}]},
//   ])
//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 5], focus: ['1', 5]},
//   })
// })

// test('should delete (complex)', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//         {
//           type: 'block',
//           key: '2',
//           name: 'ul',
//           children: [
//             {
//               type: 'block',
//               key: '3',
//               name: 'li',
//               children: [{type: 'span', key: '4', text: 'world'}],
//             },
//           ],
//         },
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['1', 5], focus: ['4', 0], userId: '@'},
//     {type: 'delete', userId: '@'}
//   )

//   const state = editor.getState()

//   expect(state.nodes).toEqual([
//     {type: 'block', key: '0', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '1', data: {}, depth: 1, size: 0, text: 'helloworld'},
//   ])
//   expect(state.value).toEqual([
//     {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'helloworld'}]},
//   ])
//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 5], focus: ['1', 5]},
//   })
// })

// test('should delete and keep (complex)', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//         {
//           type: 'block',
//           key: '2',
//           name: 'ul',
//           children: [
//             {
//               type: 'block',
//               key: '3',
//               name: 'li',
//               children: [{type: 'span', key: '4', text: 'world'}],
//             },
//             {
//               type: 'block',
//               key: '5',
//               name: 'li',
//               children: [{type: 'span', key: '6', text: 'foo'}],
//             },
//           ],
//         },
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['1', 5], focus: ['4', 0], userId: '@'},
//     {type: 'delete', userId: '@'}
//   )

//   const state = editor.getState()

//   expect(state.keys).toEqual([
//     '0',
//     '1',
//     '2',
//     // '3',
//     // '4',
//     '5',
//     '6',
//   ])
//   // console.log(state.nodes)
//   expect(state.nodes).toEqual([
//     {type: 'block', key: '0', name: 'p', data: {}, depth: 0, size: 1},
//     {type: 'span', key: '1', data: {}, depth: 1, size: 0, text: 'helloworld'},
//     {type: 'block', key: '2', name: 'ul', data: {}, depth: 0, size: 2},
//     {type: 'block', key: '5', name: 'li', data: {}, depth: 1, size: 1},
//     {type: 'span', key: '6', data: {}, depth: 2, size: 0, text: 'foo'},
//   ])
//   expect(state.value).toEqual([
//     {
//       type: 'block',
//       key: '0',
//       name: 'p',
//       children: [{type: 'span', key: '1', text: 'helloworld'}],
//     },
//     {
//       type: 'block',
//       key: '2',
//       name: 'ul',
//       children: [
//         {
//           type: 'block',
//           key: '5',
//           name: 'li',
//           children: [{type: 'span', key: '6', text: 'foo'}],
//         },
//       ],
//     },
//   ])
//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 5], focus: ['1', 5]},
//   })
// })

// test('should insert text', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//         {
//           type: 'block',
//           key: '2',
//           name: 'ul',
//           children: [
//             {
//               type: 'block',
//               key: '3',
//               name: 'li',
//               children: [{type: 'span', key: '4', text: 'world'}],
//             },
//             {
//               type: 'block',
//               key: '5',
//               name: 'li',
//               children: [{type: 'span', key: '6', text: 'foo'}],
//             },
//           ],
//         },
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['1', 5], focus: ['4', 0], userId: '@'},
//     {type: 'delete', userId: '@'},
//     {type: 'insertText', data: ', ', userId: '@'}
//   )

//   const state = editor.getState()

//   expect(state.value).toEqual([
//     {
//       type: 'block',
//       key: '0',
//       name: 'p',
//       children: [{type: 'span', key: '1', text: 'hello, world'}],
//     },
//     {
//       type: 'block',
//       key: '2',
//       name: 'ul',
//       children: [
//         {
//           type: 'block',
//           key: '5',
//           name: 'li',
//           children: [{type: 'span', key: '6', text: 'foo'}],
//         },
//       ],
//     },
//   ])
//   expect(state.selections).toEqual({
//     '@': {anchor: ['1', 7], focus: ['1', 7]},
//   })
// })

// test('should insert block', () => {
//   const editor = createEditor()

//   editor.apply(
//     {
//       type: 'setValue',
//       value: [
//         {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'hello'}]},
//       ],
//       userId: '@',
//     },
//     {type: 'select', anchor: ['1', 2], focus: ['1', 3], userId: '@'},
//     {type: 'delete', userId: '@'},
//     {type: 'insertBlock', userId: '@', blockKey: '2', spanKey: '3'}
//   )

//   const state = editor.getState()

//   expect(state.value).toEqual([
//     {type: 'block', key: '0', name: 'p', children: [{type: 'span', key: '1', text: 'he'}]},
//     {
//       type: 'block',
//       key: '2',
//       name: 'p',
//       children: [{type: 'span', key: '3', text: 'lo'}],
//     },
//   ])
// })

test('should toggle mark', () => {
  const editor = createEditor()

  editor.apply(
    {
      type: 'setValue',
      value: [
        {
          type: 'block',
          key: '0',
          name: 'p',
          children: [{type: 'span', key: '1', text: 'hello, world'}],
        },
      ],
      userId: '@',
    },
    {type: 'select', anchor: ['1', 7], focus: ['1', 10], userId: '@'},
    {type: 'toggleMark', name: 'strong', userId: '@'}
  )

  const state = editor.getState()

  expect(state.value).toEqual([
    {
      type: 'block',
      key: '0',
      name: 'p',
      children: [
        {
          type: 'span',
          key: '1',
          text: 'hello, ',
          marks: undefined,
        },
        {
          type: 'span',
          key: state.nodes[2].key,
          text: 'wor',
          marks: ['strong'],
        },
        {
          type: 'span',
          key: state.nodes[3].key,
          text: 'ld',
          marks: undefined,
        },
      ],
    },
  ])
})
