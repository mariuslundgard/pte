import {Op, State} from '../types'
import {_delete} from './delete'
import {insertBlock} from './insertBlock'
import {insertText} from './insertText'
import {select} from './select'
import {setValue} from './setValue'
import {unsetSelection} from './unsetSelection'

export function reducer(state: State, op: Op): State {
  if (op.type === 'setValue') {
    return setValue(state, op)
  }

  if (op.type === 'select') {
    return select(state, op)
  }

  if (op.type === 'unsetSelection') {
    return unsetSelection(state, op)
  }

  if (op.type === 'delete') {
    return _delete(state, op)
  }

  if (op.type === 'insertText') {
    return insertText(state, op)
  }

  if (op.type === 'insertBlock') {
    return insertBlock(state, op)
  }

  return state
}
