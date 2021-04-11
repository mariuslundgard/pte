import {getTreeMetadata} from '../helpers'
import {SetValueOp, State} from '../types'

export function setValue(state: State, op: SetValueOp): State {
  return {
    ...state,
    nodes: getTreeMetadata(op.value),
    value: op.value,
  }
}
