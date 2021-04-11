import {State, UnsetSelectionOp} from '../types'

export function unsetSelection(state: State, op: UnsetSelectionOp): State {
  const nextSelections = {...state.selections}

  delete nextSelections[op.userId]

  return {
    ...state,
    selections: nextSelections,
  }
}
