import {Box, Card, Code, studioTheme, Text, Theme, ThemeProvider} from '@sanity/ui'
import {PTBlock, PTEditor, PTNode, SelectionMap} from 'pte'
import React, {createElement, useCallback, useRef, useState} from 'react'
import {Editor} from 'react-pte'
import styled, {createGlobalStyle, css} from 'styled-components'

const INITIAL_VALUE: Node[] = [
  {
    type: 'block',
    name: 'p',
    children: [
      {
        type: 'span',
        text: 'Hello, world!!',
      },
    ],
  },
]

export const GlobalStyle = createGlobalStyle((props: {theme: Theme}) => {
  const {theme} = props
  const color = theme.sanity.color.base

  return css`
    html,
    body,
    #root {
      height: 100%;
    }

    body {
      background-color: ${color.bg};
      color: ${color.fg};
      -webkit-font-smoothing: antialiased;
      margin: 0;
    }
  `
})

const Root = styled(Card)`
  & > [contenteditable='true'] {
    border: 1px solid var(--card-border-color);
    padding: 20px;
    outline: none;

    &:focus {
      border-color: #03f;
      outline: 1px solid #03f;
    }

    &::selection,
    & ::selection {
      background: transparent;
    }

    & [data-users='foo'] {
      background: #def;
      outline: 1px solid #03f;
    }
  }
`

export function App() {
  const editor1Ref = useRef<PTEditor | null>(null)
  const [value, setValue] = useState<PTNode[]>(INITIAL_VALUE)
  const [selections, setSelections] = useState<SelectionMap | null>(null)

  const renderBlock = useCallback(
    (
      node: PTBlock,
      props: React.PropsWithoutRef<Record<string, unknown>>,
      children: React.ReactNode
    ) => {
      if (node.name === 'p') {
        return (
          <Box {...props} marginY={4}>
            <Text as="p" style={{whiteSpace: 'pre-wrap'}}>
              {children}
            </Text>
          </Box>
        )
      }

      return createElement(node.name, props, children)
    },
    []
  )

  return (
    <ThemeProvider theme={studioTheme}>
      <GlobalStyle />
      <Root padding={4}>
        <Editor
          editorRef={editor1Ref}
          id="editor"
          onChange={setValue}
          onSelections={setSelections}
          renderBlock={renderBlock}
          value={value}
          userId="foo"
        />

        <Card border marginTop={4} overflow="auto" padding={4}>
          <Code>{JSON.stringify({selections, value}, null, 2)}</Code>
        </Card>
      </Root>
    </ThemeProvider>
  )
}
