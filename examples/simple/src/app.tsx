import {Box, Card, Code, Flex, Heading, Stack, Text} from '@sanity/ui'
import {Block, Editor as EditorType, Node, Op, SelectionMap} from 'pte'
import React, {useRef, useState, useEffect, useCallback, createElement} from 'react'
import {INITIAL_VALUE} from './constants'
import {Editor} from './editor'

function renderBlock(
  node: Block,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
) {
  if (node.name === 'ul') {
    return (
      <Stack as="ul" {...props} marginY={[3, 4, 5]} space={[3, 4, 4]}>
        {children}
      </Stack>
    )
  }

  if (node.name === 'ol') {
    return (
      <Stack as="ol" {...props} marginY={[3, 4, 5]} space={[3, 4, 4]}>
        {children}
      </Stack>
    )
  }

  if (node.name === 'h1') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h1" size={[2, 3, 4]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'p') {
    return (
      <Box {...props} marginY={[3, 4, 5]}>
        <Text as="p">{children}</Text>
      </Box>
    )
  }

  if (node.name === 'li') {
    return (
      <Text as="li" {...props}>
        {children}
      </Text>
    )
  }

  return createElement(node.name, props, children)
}

export function App() {
  // editor 1
  const editor1Ref = useRef<EditorType | null>(null)
  const [selections1, setSelections1] = useState<SelectionMap>({})
  const [value1, setValue1] = useState<Node[]>(INITIAL_VALUE)

  const handleEditor1Operation = useCallback((op: Op) => {
    if (op.userId !== 'foo') return
    console.log(`${op.userId} => foo`, op)
    setTimeout(() => {
      const editor = editor2Ref.current

      if (editor) {
        editor.apply(op)
      }
    }, 0)
  }, [])

  // editor 2
  const editor2Ref = useRef<EditorType | null>(null)
  const [value2, setValue2] = useState<Node[]>(INITIAL_VALUE)

  const handleEditor2Operation = useCallback((op: Op) => {
    if (op.userId !== 'bar') return
    console.log(`${op.userId} => bar`, op)
    setTimeout(() => {
      const editor = editor1Ref.current

      if (editor) {
        editor.apply(op)
      }
    }, 0)
  }, [])

  useEffect(() => {
    // @todo: remove these debugging selections
    if (editor1Ref.current) {
      editor1Ref.current.apply({type: 'select', anchor: [1, 0], focus: [1, 5], userId: 'foo'})
    }

    if (editor2Ref.current) {
      editor2Ref.current.apply({type: 'select', anchor: [1, 4], focus: [1, 8], userId: 'bar'})
    }
  }, [])

  return (
    <Card height="fill">
      <Flex height="fill">
        <Card flex={1} overflow="auto">
          <Box padding={4}>
            <Editor
              editorRef={editor1Ref}
              onChange={setValue1}
              onOperation={handleEditor1Operation}
              onSelections={setSelections1}
              renderBlock={renderBlock}
              value={value1}
              userId="foo"
            />
          </Box>
        </Card>
        <Card borderLeft flex={1} overflow="auto">
          <Box padding={4}>
            <Editor
              editorRef={editor2Ref}
              onChange={setValue2}
              onOperation={handleEditor2Operation}
              renderBlock={renderBlock}
              value={value2}
              userId="bar"
            />
          </Box>
        </Card>
        <Card borderLeft flex={2} overflow="auto">
          <Box padding={4}>
            <Code language="json">
              {JSON.stringify(
                {
                  selections: selections1,
                  value: value1,
                },
                null,
                2
              )}
            </Code>
          </Box>
        </Card>
      </Flex>
    </Card>
  )
}
