import {
  Box,
  Card,
  // Code,
  Container,
  Flex,
  // Heading,
  // Stack,
  // Text,
} from '@sanity/ui'
import {
  // PTBlock,
  PTEditor,
  PTNode,
  PTOp,
  // State
} from 'pte'
import React, {useRef, useState, useEffect, useCallback} from 'react'
import {INITIAL_VALUE} from './constants'
import {Editor} from './editor'

export function App() {
  // editor 1
  const editor1Ref = useRef<PTEditor | null>(null)
  // const [state1, setState1] = useState<State | null>(null)
  const [value1, setValue1] = useState<PTNode[]>(INITIAL_VALUE)

  const handleEditor1Operation = useCallback((op: PTOp) => {
    if (op.userId !== 'foo') return
    console.log(`${op.userId} => bar`, op)
    setTimeout(() => {
      const editor = editor2Ref.current

      if (editor) {
        editor.apply(op)
      }
    }, 0)
  }, [])

  // editor 2
  const editor2Ref = useRef<PTEditor | null>(null)
  const [value2, setValue2] = useState<PTNode[]>(INITIAL_VALUE)

  const handleEditor2Operation = useCallback((op: PTOp) => {
    if (op.userId !== 'bar') return
    console.log(`${op.userId} => foo`, op)
    setTimeout(() => {
      const editor = editor1Ref.current

      if (editor) {
        editor.apply(op)
      }
    }, 0)
  }, [])

  useEffect(() => {
    // @todo: remove these debugging selections
    if (editor1Ref.current && editor2Ref.current) {
      editor1Ref.current.apply({
        type: 'select',
        anchor: [INITIAL_VALUE[0].children[0].key, 0],
        focus: [INITIAL_VALUE[0].children[0].key, 5],
        userId: 'foo',
      })
      editor2Ref.current.apply({
        type: 'select',
        anchor: [INITIAL_VALUE[0].children[0].key, 4],
        focus: [INITIAL_VALUE[0].children[0].key, 8],
        userId: 'bar',
      })
    }
  }, [])

  return (
    <Card height="fill">
      <Flex height="fill">
        <Card flex={1} overflow="auto">
          <Container width={1}>
            <Box padding={4}>
              <Editor
                editorRef={editor1Ref}
                onChange={setValue1}
                onOperation={handleEditor1Operation}
                // onState={setState1}
                value={value1}
                userId="foo"
              />
            </Box>
          </Container>
        </Card>
        <Card borderLeft flex={1} overflow="auto">
          <Container width={1}>
            <Box padding={4}>
              <Editor
                editorRef={editor2Ref}
                onChange={setValue2}
                onOperation={handleEditor2Operation}
                value={value2}
                userId="bar"
              />
            </Box>
          </Container>
        </Card>
        {/* <Card borderLeft flex={2} overflow="auto">
          <Box padding={4}>
            <Code language="json">
              {JSON.stringify(
                {
                  selections: state1?.selections,
                  value: state1?.value,
                },
                null,
                2
              )}
            </Code>
          </Box>
        </Card> */}
      </Flex>
    </Card>
  )
}
