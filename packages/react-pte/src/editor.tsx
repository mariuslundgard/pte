import {PTBlock, createEditor, PTEditor, PTNode, PTOp, SelectionMap} from 'pte'
import React, {useEffect, useRef, useState, forwardRef, useCallback} from 'react'
import {Children} from './children'

export interface EditorProps {
  className?: string
  editorRef?: React.Ref<PTEditor>
  onChange?: (value: PTNode[]) => void
  onOperation?: (op: PTOp) => void
  onSelections?: (selections: SelectionMap) => void
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

export const Editor = forwardRef(
  (
    props: EditorProps & Omit<React.HTMLProps<HTMLDivElement>, 'as' | 'onChange' | 'ref' | 'value'>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const {
      editorRef: editorRefProp,
      onChange,
      onOperation,
      onSelections,
      readOnly,
      renderBlock,
      value: valueProp,
      userId,
      ...restProps
    } = props

    const rootRef = useRef<HTMLDivElement | null>(null)
    const valueRef = useRef<PTNode[]>(valueProp || [])
    const [value, setValue] = useState<PTNode[]>(valueRef.current)
    const [selections, setSelections] = useState<SelectionMap>({})
    const editorRef = useRef<PTEditor | null>(null)

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
          onOperation,
          onSelections: handleSelections,
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
    }, [editorRefProp, handleSelections, onChange, onOperation, readOnly, userId])

    useEffect(() => {
      if (valueProp && valueProp !== valueRef.current) {
        if (editorRef.current) editorRef.current.setValue(valueProp)
        valueRef.current = valueProp
      }
    }, [valueProp])

    return (
      <div
        {...restProps}
        contentEditable={!readOnly}
        data-gramm={false}
        ref={(val) => {
          rootRef.current = val
          if (ref) setRef<HTMLDivElement>(ref, val)
        }}
        suppressContentEditableWarning
      >
        <Children nodes={value} renderBlock={renderBlock} selections={selections} />
      </div>
    )
  }
)

Editor.displayName = 'Editor'
