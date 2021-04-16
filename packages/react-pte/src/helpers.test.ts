import {SelectionMap} from 'pte'

function getUserChunks(selections: SelectionMap, nodeOffset: number, text: string) {
  const ret: any = []
  const textLength = text.length
  const textOffsets: number[] = [0]
  const selectionEntries = Object.entries(selections)

  for (const [, selection] of selectionEntries) {
    if (selection) {
      const startOffset = selection.anchor[0] === nodeOffset && selection.anchor[1]
      const endOffset = selection.focus[0] === nodeOffset && selection.focus[1]

      if (typeof startOffset === 'number' && !textOffsets.includes(startOffset)) {
        textOffsets.push(startOffset)
      }

      if (typeof endOffset === 'number' && !textOffsets.includes(endOffset)) {
        textOffsets.push(endOffset)
      }
    }
  }

  if (!textOffsets.includes(textLength)) {
    textOffsets.push(textLength)
  }

  textOffsets.sort((a, b) => a - b)

  return ret
}

describe('getUserChunks', () => {
  it('should', () => {
    const selections: SelectionMap = {
      foo: {anchor: [0, 0], focus: [0, 10]},
      bar: {anchor: [0, 2], focus: [0, 12]},
    }

    const userChunks = getUserChunks(selections, 0, 'Hello, world')

    console.log(userChunks)

    // expect(userChunks).toEqual([
    //   {type: 'text', text: 'Hello, wor', userIds: ['foo']},
    //   {type: 'cursor', userIds: ['foo']},
    //   {type: 'text', text: 'ld', userIds: []},
    // ])
  })
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
