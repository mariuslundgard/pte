import {getDOMNodeAtOffset, getDOMSelection, isCollapsed} from './helpers'
import {reducer} from './reducer'
import {Editor, Node, Op, SelectionMap, State} from './types'

interface EditorOpts {
  element?: Element
  initialValue?: Node[]
  onOperation?: (op: Op) => void
  onSelections?: (sel: SelectionMap) => void
  onValue?: (value: Node[]) => void
  readOnly?: boolean
  userId?: string
}

export function createEditor(opts: EditorOpts = {}): Editor {
  const {element, initialValue, onOperation, onSelections, onValue, readOnly} = opts
  const userId = opts.userId || '@'

  let state: State = {
    nodes: [],
    selections: {},
    value: [],
  }

  let isApplying = false

  let applyTimeout: NodeJS.Timeout | null = null

  function apply(...ops: Op[]) {
    const prevState = state

    for (const op of ops) {
      state = reducer(state, op)

      if (onOperation) {
        onOperation(op)
      }
    }

    if (onValue && prevState.value !== state.value) {
      onValue(state.value)
    }

    if (onSelections && prevState.selections !== state.selections) {
      onSelections(state.selections)
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

  function setValue(newValue: Node[]) {
    apply({type: 'setValue', value: newValue, userId})
  }

  __init()

  return {apply, destroy, getState, setValue}

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

    // console.log('beforeinput', event)

    event.preventDefault()

    if (applyTimeout) {
      clearTimeout(applyTimeout)
      applyTimeout = null
    }

    isApplying = true

    _handleInput(event.inputType, event.data)
    _updateDOMSelection()

    applyTimeout = setTimeout(() => {
      isApplying = false
    }, 0)
  }

  function _handleBlur() {
    // console.log('blur')

    apply({type: 'unsetSelection', userId})

    document.removeEventListener('selectionchange', _handleSelectionChange)
  }

  function _handleFocus() {
    // console.log('focus')

    document.addEventListener('selectionchange', _handleSelectionChange)
  }

  function _handleInput(type: string, data: string | null) {
    // console.log('input', type, data, JSON.stringify(state.selections[userId]))

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

      apply({type: 'insertBlock', userId})

      return
    }

    if (type === 'deleteContentBackward') {
      apply({type: 'delete', userId})

      return
    }

    console.warn('unhandled', {type, data})
  }

  function _handleSelectionChange() {
    if (isApplying) return

    const sel = getDOMSelection()

    if (sel) {
      if (applyTimeout) {
        clearTimeout(applyTimeout)
        applyTimeout = null
      }

      isApplying = true

      // console.log('selectionchange', JSON.stringify([sel.anchor, sel.focus]))

      apply({type: 'select', ...sel, userId})

      _updateDOMSelection()

      applyTimeout = setTimeout(() => {
        isApplying = false
      }, 0)
    }
  }

  function _updateDOMSelection() {
    const sel = state.selections[userId]

    if (!sel) return

    const winSel = window.getSelection()

    if (element && winSel && sel.anchor) {
      winSel.removeAllRanges()

      const range = document.createRange()

      range.setStart(...getDOMNodeAtOffset(element, sel.anchor))
      range.setEnd(...getDOMNodeAtOffset(element, sel.focus))

      winSel.addRange(range)
    }
  }
}
