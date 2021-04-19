import {SelectionMap} from 'pte'
import {getUserChunks} from './getUserChunks'

describe('getUserChunks', () => {
  it('should (1)', () => {
    const selections: SelectionMap = {
      foo: {anchor: ['0', 0], focus: ['0', 10]},
    }

    const userChunks = getUserChunks(['0'], selections, '0', 'Hello, world')

    expect(userChunks).toEqual([
      {type: 'text', text: 'Hello, wor', userIds: ['foo']},
      {type: 'cursor', userIds: ['foo']},
      {type: 'text', text: 'ld', userIds: []},
    ])
  })

  it('should (2)', () => {
    const selections: SelectionMap = {
      foo: {anchor: ['0', 0], focus: ['0', 10]},
      bar: {anchor: ['0', 2], focus: ['0', 12]},
    }

    const userChunks = getUserChunks(['0'], selections, '0', 'Hello, world')

    expect(userChunks).toEqual([
      {type: 'text', text: 'He', userIds: ['foo']},
      {type: 'text', text: 'llo, wor', userIds: ['foo', 'bar']},
      {type: 'cursor', userIds: ['foo']},
      {type: 'text', text: 'ld', userIds: ['bar']},
      {type: 'cursor', userIds: ['bar']},
    ])
  })

  it('should (3)', () => {
    const selections: SelectionMap = {
      foo: {anchor: ['0', 0], focus: ['0', 0]},
    }

    const userChunks = getUserChunks(['0'], selections, '0', 'Hello, world')

    // console.log(userChunks)

    expect(userChunks).toEqual([
      {type: 'cursor', userIds: ['foo']},
      {type: 'text', text: 'Hello, world', userIds: []},
    ])
  })

  it('should (4)', () => {
    const selections: SelectionMap = {
      foo: {anchor: ['0', 0], focus: ['0', 0]},
      bar: {anchor: ['0', 10], focus: ['0', 10]},
      baz: {anchor: ['0', 12], focus: ['0', 12]},
    }

    const userChunks = getUserChunks(['0'], selections, '0', 'Hello, world')

    // console.log(userChunks)

    expect(userChunks).toEqual([
      {type: 'cursor', userIds: ['foo']},
      {type: 'text', text: 'Hello, wor', userIds: []},
      {type: 'cursor', userIds: ['bar']},
      {type: 'text', text: 'ld', userIds: []},
      {type: 'cursor', userIds: ['baz']},
    ])
  })

  // it('should (5)', () => {
  //   const selections: SelectionMap = {
  //     // foo: {anchor: [0, 0], focus: [0, 0]},
  //   }

  //   const userChunks = getUserChunks(['0'], selections, '0', '')

  //   expect(userChunks).toEqual([
  //     // {type: 'cursor', userIds: ['foo']},
  //     {type: 'text', text: '', userIds: []},
  //   ])
  // })
})

// describe('getSpanSelections', () => {
//   test('should ...', () => {
//     expect(
//       getSpanSelections(
//         {
//           foo: {anchor: [0, 0], focus: [0, 0]},
//         },
//         0
//       )
//     ).toEqual({
//       foo: {anchor: [0, 0], focus: [0, 0]},
//     })

//     expect(
//       getSpanSelections(
//         {
//           foo: {anchor: [0, 0], focus: [5, 0]},
//           bar: {anchor: [3, 0], focus: [10, 0]},
//         },
//         4
//       )
//     ).toEqual({
//       foo: {anchor: [0, 0], focus: [5, 0]},
//       bar: {anchor: [3, 0], focus: [10, 0]},
//     })
//   })
// })

// describe('getTextChunks', () => {
//   test('should 1', () => {
//     const text = 'hello, world'
//     const offset = 0
//     const selections: SelectionMap = {
//       foo: {anchor: [0, 0], focus: [0, 5]},
//       bar: {anchor: [0, 7], focus: [0, 12]},
//     }
//     const spanSelections = getNodeSelections(selections, offset, text)

//     expect(spanSelections).toEqual([
//       {start: 0, stop: 5, userId: 'foo'},
//       {start: 7, stop: 12, userId: 'bar'},
//     ])

//     const chunks = getTextChunks(spanSelections, text)

//     expect(chunks).toEqual([
//       {type: 'text', text: 'hello', users: ['foo']},
//       {type: 'cursor', users: ['foo']},
//       {type: 'text', text: ', ', users: []},
//       {type: 'text', text: 'world', users: ['bar']},
//       {type: 'cursor', users: ['bar']},
//     ])
//   })

//   test('should 2', () => {
//     const text = 'hello, world'
//     const offset = 0
//     const selections: SelectionMap = {
//       foo: {anchor: [0, 5], focus: [0, 5]},
//       bar: {anchor: [0, 12], focus: [0, 12]},
//     }
//     const spanSelections = getNodeSelections(selections, offset, text)
//     const chunks = getTextChunks(spanSelections, text)

//     expect(spanSelections).toEqual([
//       {start: 5, stop: 5, userId: 'foo'},
//       {start: 12, stop: 12, userId: 'bar'},
//     ])

//     expect(chunks).toEqual([
//       {text: 'hello', users: []},
//       {text: '', users: ['foo']},
//       {text: ', world', users: []},
//       {text: '', users: ['bar']},
//     ])
//   })
// })
