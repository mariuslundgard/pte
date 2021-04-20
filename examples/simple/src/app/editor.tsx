import {hues} from '@sanity/color'
import {BoldIcon, ItalicIcon} from '@sanity/icons'
import {Box, Button, Card, Code, Inline, Select} from '@sanity/ui'
import {BlockNodeMetadata, PTEditor, State} from 'packages/pte/dist/cjs'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import {Editor as PTE, EditorProps} from 'react-pte'
import styled, {css, keyframes} from 'styled-components'
import {multiply, screen} from './helpers'
import {renderBlock} from './renderBlock'
import {focusRingBorderStyle, focusRingStyle} from './styles'

interface PTEProps
  extends EditorProps,
    Omit<React.HTMLProps<HTMLDivElement>, 'as' | 'onChange' | 'ref' | 'value'> {}

const user1 = hues.blue
const user2 = hues.magenta

const blink = keyframes`
  0%,
  49.999% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
`

export const Root = styled(Card)(({theme}) => {
  const blend = theme.sanity.color.dark ? screen : multiply
  const {focusRing, input} = theme.sanity
  const {base, input: inputColor} = theme.sanity.color

  return css`
    /* border: 1px solid var(--card-border-color); */
    --pte-box-shadow: ${focusRingBorderStyle({
      color: inputColor.default.enabled.border,
      width: input.border.width,
    })};

    box-shadow: var(--pte-box-shadow);

    & [data-text][data-marks~='strong'] {
      font-weight: 700;
    }

    & [data-text][data-marks~='italic'] {
      font-style: italic;
    }

    &:focus-within {
      /* border-color: ${hues.blue[500].hex}; */
      /* outline: 1px solid ${hues.blue[500].hex}; */
      --pte-box-shadow: ${focusRingStyle({
        base,
        border: {
          color: inputColor.default.enabled.border,
          width: input.border.width,
        },
        focusRing,
      })};
    }

    & > [contenteditable='true'] {
      padding: 20px;
      outline: none;
      white-space: pre-wrap;
      font-kerning: none;
      outline: none;

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
            left: -1px;
            bottom: 0;
            border-left: 2px solid transparent;
          }
        }

        & [data-text]:not([data-users='']) {
          background: ${hues.gray[100].hex};
        }

        & [data-cursor]:not([data-users='']) {
          position: relative;

          &:after {
            border-color: ${hues.gray[500].hex};
          }
        }

        & [data-text][data-users='foo'] {
          background: ${user1[100].hex};
        }

        & [data-cursor][data-users='foo'] {
          &:after {
            border-color: ${user1[500].hex};
          }
        }

        & [data-text][data-users='bar'] {
          background: ${user2[100].hex};
        }

        & [data-cursor][data-users='bar'] {
          &:after {
            border-color: ${user2[500].hex};
          }
        }

        & [data-text][data-users='foo,bar'],
        & [data-text][data-users='bar,foo'] {
          background: ${blend(user1[100].hex, user2[100].hex)};
        }

        & [data-cursor][data-users='foo,bar'],
        & [data-cursor][data-users='bar,foo'] {
          &:after {
            border-color: ${blend(user1[500].hex, user2[500].hex)};
          }
        }
      }
    }
  `
})

export function Editor(props: PTEProps) {
  const {editorRef: editorRefProp, onState, userId = '@', ...restProps} = props
  const [state, setState] = useState<State | null>(null)
  const editorRef = useRef<PTEditor | null>(null)

  const handleState = useCallback(
    (newState: State) => {
      setState(newState)
      if (onState) onState(newState)
    },
    [onState]
  )

  const selectedBlock = useMemo(() => {
    if (!state) {
      return null
    }

    const userSelection = state.selections[userId]

    if (!userSelection) {
      return null
    }

    let nodeOffset = state.keys.indexOf(userSelection.anchor[0])

    while (state.nodes[nodeOffset] && state.nodes[nodeOffset].type !== 'block') {
      nodeOffset -= 1
    }

    return state.nodes[nodeOffset] as BlockNodeMetadata
  }, [state, userId])

  const handleChangeBlockName = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newBlockName = event.currentTarget.value

      if (editorRef.current) {
        editorRef.current.updateBlock({name: newBlockName})
      }
    },
    [editorRef]
  )

  const setEditor = useCallback(
    (editor: PTEditor | null) => {
      editorRef.current = editor

      if (typeof editorRefProp === 'function') {
        editorRefProp(editor)
      } else if (editorRefProp) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(editorRefProp.current as any) = editor
      }
    },
    [editorRefProp]
  )

  const toggleMark = useCallback((markName: string) => {
    if (editorRef.current) {
      editorRef.current.toggleMark(markName)
    }
  }, [])

  return (
    <>
      <Root radius={3}>
        <Box padding={1} style={{borderBottom: '1px solid var(--card-border-color)'}}>
          <Inline space={1}>
            <Select
              disabled={!selectedBlock}
              onChange={handleChangeBlockName}
              padding={2}
              radius={2}
              value={selectedBlock?.name || 'p'}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
            </Select>
            <Button icon={BoldIcon} mode="bleed" onClick={() => toggleMark('strong')} padding={2} />
            <Button
              icon={ItalicIcon}
              mode="bleed"
              onClick={() => toggleMark('italic')}
              padding={2}
            />
          </Inline>
        </Box>
        <PTE
          {...restProps}
          editorRef={setEditor}
          onState={handleState}
          renderBlock={renderBlock}
          userId={userId}
        />
      </Root>
      <Card marginTop={3} padding={4} radius={2} tone="transparent">
        <Code language="json">{JSON.stringify({selections: state?.selections}, null, 2)}</Code>
      </Card>
    </>
  )
}
