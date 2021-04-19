import {
  createId,
  getDOMNodeAtOffset,
  getDOMSelection,
  isCollapsed,
  setDOMSelection,
} from './helpers'
import {reducer} from './reducer'
import {PTEditor, PTNode, PTOp, SelectionMap, State} from './types'

interface EditorOpts {
  element?: Element
  initialValue?: PTNode[]
  onKeys?: (keys: string[]) => void
  onOperation?: (op: PTOp) => void
  onSelections?: (sel: SelectionMap) => void
  onState?: (state: State) => void
  onValue?: (value: PTNode[]) => void
  readOnly?: boolean
  userId?: string
}

export function createEditor(opts: EditorOpts = {}): PTEditor {
  const {
    element,
    initialValue,
    onKeys,
    onOperation,
    onSelections,
    onState,
    onValue,
    readOnly,
  } = opts
  const userId = opts.userId || '@'

  let state: State = {
    keys: [],
    nodes: [],
    selections: {},
    value: [],
  }

  let isSelecting = false

  function apply(...ops: PTOp[]) {
    const prevState = state

    for (const op of ops) {
      state = reducer(state, op)

      if (onOperation) {
        onOperation(op)
      }
    }

    if (onKeys && prevState.keys !== state.keys) {
      onKeys(state.keys)
    }

    if (onValue && prevState.value !== state.value) {
      onValue(state.value)
    }

    if (onSelections && prevState.selections !== state.selections) {
      onSelections(state.selections)
    }

    if (onState && prevState !== state) {
      onState(state)
    }
  }

  function destroy() {
    if (!readOnly) {
      if (element) {
        element.removeEventListener('beforeinput', _handleBeforeInput)
        element.removeEventListener('blur', _handleBlur)
        element.removeEventListener('focus', _handleFocus)
      }

      document.removeEventListener('selectionchange', _handleSelectionChange)
    }
  }

  function getState() {
    return state
  }

  function setValue(newValue: PTNode[]) {
    apply({type: 'setValue', value: newValue, userId})
  }

  function updateBlock(data: Record<string, unknown>) {
    // console.log('update block', data, userId)
    apply({type: 'updateBlock', data, userId})
  }

  __init()

  const editor = {apply, destroy, getState, setValue, updateBlock, updateDOMSelection}

  return editor

  // private methods

  function __init() {
    if (!readOnly && element) {
      element.addEventListener('beforeinput', _handleBeforeInput)
      element.addEventListener('blur', _handleBlur)
      element.addEventListener('focus', _handleFocus)
    }

    // set initial value
    if (initialValue) {
      setTimeout(() => {
        apply({
          type: 'setValue',
          value: initialValue,
          userId,
        })
      }, 0)
    }
  }

  function _handleBeforeInput(_event: Event) {
    const event = _event as InputEvent

    event.preventDefault()

    _handleInput(event.inputType, event.data)
  }

  function _handleBlur() {
    // console.log('blur')

    // apply({type: 'unsetSelection', userId})

    document.removeEventListener('selectionchange', _handleSelectionChange)
  }

  function _handleFocus() {
    // console.log('focus')

    document.addEventListener('selectionchange', _handleSelectionChange)
  }

  function _handleInput(type: string, data: string | null) {
    // console.log('input')

    if (type === 'insertText') {
      if (data) {
        const sel = state.selections[userId]

        if (!sel) {
          throw new Error('missing selection')
        }

        if (!isCollapsed(sel)) {
          apply({type: 'delete', userId})
        }

        apply({type: 'insertText', data: data, userId})
      }

      return
    }

    if (type === 'insertParagraph') {
      const sel = state.selections[userId]

      if (!sel) {
        throw new Error('missing selection')
      }

      if (!isCollapsed(sel)) {
        apply({type: 'delete', userId})
      }

      apply({type: 'insertBlock', userId, blockKey: createId(), spanKey: createId()})

      return
    }

    if (type === 'deleteContentBackward') {
      apply({type: 'delete', userId})

      return
    }

    console.warn('unhandled', {type, data})
  }

  function _handleSelectionChange() {
    if (isSelecting) return

    const domSelection = window.getSelection()

    const sel = getDOMSelection(domSelection)

    if (sel) {
      // console.log('select', JSON.stringify(sel))

      // setTimeout(() => {
      apply({type: 'select', ...sel, userId})
      // }, 0)
    }
  }

  function updateDOMSelection() {
    const domSelection = window.getSelection()
    const sel = state.selections[userId]

    if (!element || !domSelection || !sel) return

    // console.log('update selection', JSON.stringify(sel))

    try {
      isSelecting = true

      const start = getDOMNodeAtOffset(element, sel.anchor)
      const end = getDOMNodeAtOffset(element, sel.focus)

      // console.log(
      //   '>>>',
      //   JSON.stringify(
      //     {
      //       start: {
      //         html: start.node.innerHTML,
      //         offset: start.offset,
      //       },
      //       end: {
      //         html: end.node.innerHTML,
      //         offset: end.offset,
      //       },
      //     },
      //     null,
      //     2
      //   )
      // )

      // debugger

      if (setDOMSelection(domSelection, start, end)) {
        setTimeout(() => {
          isSelecting = false
        }, 0)

        return
      }

      console.warn('could not set DOM selection')
    } catch (err) {
      console.error(err)
    }

    isSelecting = false
  }
}
