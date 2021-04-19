import {hues} from '@sanity/color'
import {Box, Card, Code, studioTheme, Text, Theme, ThemeProvider} from '@sanity/ui'
import {createId, PTBlock, PTEditor, PTNode, SelectionMap} from 'pte'
import React, {createElement, useCallback, useRef, useState} from 'react'
import {Editor} from 'react-pte'
import styled, {createGlobalStyle, css, keyframes} from 'styled-components'

const features = {
  // userSelection: false,
}

const INITIAL_VALUE: PTNode[] = [
  {
    type: 'block',
    key: createId(),
    name: 'p',
    children: [
      {
        type: 'span',
        key: createId(),
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

const blink = keyframes`
  0%,
  49.999% {
    opacity: 0;
  }
  50%,
  100% {
    opacity: 1;
  }
`

const Root = styled(Card)`
  & > [contenteditable='true'] {
    border: 1px solid var(--card-border-color);
    padding: 20px;
    outline: none;
    white-space: pre-wrap;
    font-kerning: none;

    &:focus {
      border-color: ${hues.blue[500].hex};
      outline: 1px solid ${hues.blue[500].hex};
    }

    &[data-feature-user-selection='true'] {
      caret-color: transparent;

      &::selection,
      & ::selection {
        background: transparent;
      }

      & [data-cursor] {
        position: relative;
        animation: ${blink} 1s linear infinite;

        &:after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
        }
      }

      & [data-text]:not([data-users='']) {
        background: ${hues.purple[100].hex};
      }

      & [data-cursor]:not([data-users='']) {
        position: relative;

        &:after {
          border-left: 1px solid ${hues.purple[500].hex};
        }
      }

      & [data-text][data-users='foo'] {
        background: ${hues.purple[100].hex};
      }

      & [data-cursor][data-users='foo'] {
        &:after {
          border-left: 1px solid ${hues.purple[500].hex};
        }
      }
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
            <Text as="p">{children}</Text>
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
          features={features}
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
