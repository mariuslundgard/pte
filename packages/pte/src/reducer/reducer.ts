import {PTOp, State} from '../types'
import {_delete} from './delete'
import {insertBlock} from './insertBlock'
import {insertText} from './insertText'
import {select} from './select'
import {setValue} from './setValue'
import {unsetSelection} from './unsetSelection'
import {updateBlock} from './updateBlock'

export function reducer(state: State, op: PTOp): State {
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

  if (op.type === 'updateBlock') {
    return updateBlock(state, op)
  }

  return state
}
