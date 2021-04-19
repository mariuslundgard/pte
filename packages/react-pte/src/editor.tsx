import {PTBlock, createEditor, PTEditor, PTNode, PTOp, SelectionMap, State} from 'pte'
import React, {useEffect, useRef, useState, forwardRef, useCallback, useMemo} from 'react'
import {Children} from './children'
import {Features} from './types'

export interface EditorProps {
  className?: string
  editorRef?: React.Ref<PTEditor>
  features?: Partial<Features>
  onChange?: (value: PTNode[]) => void
  onOperation?: (op: PTOp) => void
  onSelections?: (selections: SelectionMap) => void
  onState?: (state: State) => void
  readOnly?: boolean
  renderBlock?: (
    node: PTBlock,
    props: React.PropsWithoutRef<Record<string, unknown>>,
    children: React.ReactNode
  ) => React.ReactElement
  value?: PTNode[]
  style?: React.CSSProperties
  userId?: string
}

function setRef<T>(
  ref: ((instance: T | null) => void) | React.MutableRefObject<T | null>,
  value: T | null
) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

function useFeatures(opts?: Partial<Features>): Features {
  return useMemo(() => {
    const {userSelection = true} = opts || {}

    return {
      userSelection,
    }
  }, [opts])
}

export const Editor = forwardRef(function Editor(
  props: EditorProps & Omit<React.HTMLProps<HTMLDivElement>, 'as' | 'onChange' | 'ref' | 'value'>,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    editorRef: editorRefProp,
    features: featuresProp,
    onChange,
    onOperation,
    onSelections,
    onState,
    readOnly,
    renderBlock,
    value: valueProp,
    userId = '@',
    ...restProps
  } = props
  const features = useFeatures(featuresProp)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const valueRef = useRef<PTNode[]>(valueProp || [])
  const [keys, setKeys] = useState<string[]>([])
  const [value, setValue] = useState<PTNode[]>(valueRef.current)
  const [selections, setSelections] = useState<SelectionMap>({})
  const editorRef = useRef<PTEditor | null>(null)
  const userSelection = selections[userId]

  const handleSelections = useCallback(
    (nextSelections: SelectionMap) => {
      setSelections(nextSelections)
      if (onSelections) onSelections(nextSelections)
    },
    [onSelections]
  )

  useEffect(() => {
    const element = rootRef.current

    const handleValue = (newValue: PTNode[]) => {
      if (newValue !== valueRef.current) {
        valueRef.current = newValue
        setValue(newValue)
        if (onChange) onChange(newValue)
      }
    }

    if (element) {
      editorRef.current = createEditor({
        element,
        initialValue: valueRef.current,
        onKeys: setKeys,
        onOperation,
        onSelections: handleSelections,
        onState,
        onValue: handleValue,
        readOnly,
        userId,
      })

      if (editorRefProp) setRef<PTEditor>(editorRefProp, editorRef.current)
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
        if (editorRefProp) setRef<PTEditor>(editorRefProp, editorRef.current)
      }
    }
  }, [editorRefProp, handleSelections, onChange, onOperation, onState, readOnly, userId])

  useEffect(() => {
    if (valueProp && valueProp !== valueRef.current) {
      editorRef.current?.setValue(valueProp)
      valueRef.current = valueProp
    }
  }, [valueProp])

  useEffect(() => {
    // console.log('userSelection', JSON.stringify(userSelection))
    editorRef.current?.updateDOMSelection()
  }, [userSelection])

  const _setRef = useCallback(
    (val) => {
      rootRef.current = val
      if (ref) setRef<HTMLDivElement>(ref, val)
    },
    [ref]
  )

  // console.log('--- RENDER ---')

  return (
    <div
      {...restProps}
      contentEditable={!readOnly}
      data-feature-user-selection={features.userSelection}
      data-gramm={false}
      ref={_setRef}
      suppressContentEditableWarning
    >
      <Children
        features={features}
        keys={keys}
        nodes={value}
        renderBlock={renderBlock}
        selections={selections}
      />
    </div>
  )
})
