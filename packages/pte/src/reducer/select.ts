import {SelectOp, State} from '../types'

export function select(state: State, op: SelectOp): State {
  const userSelection = state.selections[op.userId]

  if (
    userSelection &&
    userSelection.anchor[0] === op.anchor[0] &&
    userSelection.anchor[1] === op.anchor[1] &&
    userSelection.focus[0] === op.focus[0] &&
    userSelection.focus[1] === op.focus[1]
  ) {
    return state
  }

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
