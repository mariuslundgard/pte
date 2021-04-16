import {getDOMNodeAtOffset, getDOMSelection, isCollapsed} from './helpers'
import {reducer} from './reducer'
import {PTEditor, PTNode, PTOp, SelectionMap, State} from './types'

interface EditorOpts {
  element?: Element
  initialValue?: PTNode[]
  onOperation?: (op: PTOp) => void
  onSelections?: (sel: SelectionMap) => void
  onValue?: (value: PTNode[]) => void
  readOnly?: boolean
  userId?: string
}

export function createEditor(opts: EditorOpts = {}): PTEditor {
  const {element, initialValue, onOperation, onSelections, onValue, readOnly} = opts
  const userId = opts.userId || '@'

  let state: State = {
    nodes: [],
    selections: {},
    value: [],
  }

  let isApplying = false

  let applyTimeout: NodeJS.Timeout | null = null

  function apply(...ops: PTOp[]) {
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

  function setValue(newValue: PTNode[]) {
    apply({type: 'setValue', value: newValue, userId})
  }

  __init()

  const editor = {apply, destroy, getState, setValue}

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

    // console.log('beforeinput', event)

    event.preventDefault()

    if (applyTimeout) {
      clearTimeout(applyTimeout)
      applyTimeout = null
    }

    isApplying = true

    _handleInput(event.inputType, event.data)

    applyTimeout = setTimeout(() => {
      _updateDOMSelection()
      isApplying = false
    }, 0)
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
      console.log('[dom] -> select', JSON.stringify([sel.anchor, sel.focus]))

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
    try {
      const sel = state.selections[userId]

      if (!sel) return

      const winSel = window.getSelection()

      if (element && winSel && sel.anchor) {
        const start = getDOMNodeAtOffset(element, sel.anchor)
        const end = getDOMNodeAtOffset(element, sel.focus)

        if (start[0].firstChild instanceof Node && end[0].firstChild instanceof Node) {
          winSel.removeAllRanges()

          const range = document.createRange()

          if (start[0].firstChild instanceof Node) {
            range.setStart(start[0].firstChild, start[1])
          }

          if (end[0].firstChild instanceof Node) {
            range.setEnd(end[0].firstChild, end[1])
          }

          winSel.addRange(range)

          console.log(
            '[dom] <- select',
            JSON.stringify([
              [sel.anchor[0], start[1]],
              [sel.focus[0], end[1]],
            ])
          )

          return
        }

        console.warn('unexpected node start or end node', {
          start: start[0].firstChild,
          end: end[0].firstChild,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }
}
