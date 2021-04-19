import {getTreeMetadata} from '../helpers'
import {SetValueOp, State} from '../types'

export function setValue(state: State, op: SetValueOp): State {
  const nodes = getTreeMetadata(op.value)
  const keys = nodes.map((n) => n.key)

  return {
    ...state,
    keys,
    nodes,
    value: op.value,
  }
}
