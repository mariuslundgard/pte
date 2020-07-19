import {SelectionMap} from 'pte'
import {getTextChunks, getNodeSelections} from '../helpers'

test('should 1', () => {
  const text = 'hello, world'
  const offset = 0
  const selections: SelectionMap = {
    foo: {anchor: [0, 0], focus: [0, 5]},
    bar: {anchor: [0, 7], focus: [0, 12]},
  }
  const spanSelections = getNodeSelections(selections, offset, text)
  const chunks = getTextChunks(spanSelections, text)

  expect(spanSelections).toEqual([
    {start: 0, stop: 5, userId: 'foo'},
    {start: 7, stop: 12, userId: 'bar'},
  ])

  expect(chunks).toEqual([
    {text: '', users: ['foo']},
    {text: 'hello', users: ['foo']},
    {text: '', users: ['foo']},
    {text: ', ', users: []},
    {text: '', users: ['bar']},
    {text: 'world', users: ['bar']},
    {text: '', users: ['bar']},
  ])
})

test('should 2', () => {
  const text = 'hello, world'
  const offset = 0
  const selections: SelectionMap = {
    foo: {anchor: [0, 5], focus: [0, 5]},
    bar: {anchor: [0, 12], focus: [0, 12]},
  }
  const spanSelections = getNodeSelections(selections, offset, text)
  const chunks = getTextChunks(spanSelections, text)

  expect(spanSelections).toEqual([
    {start: 5, stop: 5, userId: 'foo'},
    {start: 12, stop: 12, userId: 'bar'},
  ])

  expect(chunks).toEqual([
    {text: 'hello', users: []},
    {text: '', users: ['foo']},
    {text: ', world', users: []},
    {text: '', users: ['bar']},
  ])
})
