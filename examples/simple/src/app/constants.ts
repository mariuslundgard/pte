import {block, span} from './helpers'

export const INITIAL_VALUE = [
  block('h1', span('Hello, world')),
  block('p', span('Hello, world')),
  block(
    'ul',
    block('li', span('List item 1')),
    block('li', span('List item 2')),
    block('li', span('List item 3')),
    block('li', span('List item 4'))
  ),
  block('p', span('Hello, world')),
  block(
    'ol',
    block('li', span('List item 1')),
    block('li', span('List item 2')),
    block('li', span('List item 3')),
    block('li', span('List item 4'))
  ),
  block('p', span('Hello, world')),
  block('p', span('Hello, world')),
  block('p', span('Hello, world')),
]
