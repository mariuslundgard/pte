import {SelectOp, State} from '../types'

export function select(state: State, op: SelectOp): State {
  const selections = {
    ...state.selections,
    [op.userId]: {
      anchor: op.anchor,
      focus: op.focus,
    },
  }

  return {
    ...state,
    selections,
  }
}
