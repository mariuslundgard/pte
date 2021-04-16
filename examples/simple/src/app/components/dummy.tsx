import {hues} from '@sanity/color'
import React from 'react'
import styled, {keyframes} from 'styled-components'

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

const Span = styled.span`
  &[data-user='foo'] {
    background-color: ${hues.blue[100].hex};
  }

  &[data-user='bar'] {
    background-color: ${hues.magenta[100].hex};
  }
`

const Cursor = styled.span`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    bottom: 0;
    border-left: 2px solid ${hues.blue[600].hex};
    animation: ${blink} 1s linear infinite;
  }

  &[data-user='foo']:after {
    border-left: 2px solid ${hues.blue[600].hex};
  }

  &[data-user='bar']:after {
    border-left: 2px solid ${hues.magenta[600].hex};
  }
`

export function Dummy() {
  return (
    <>
      <Cursor data-user="foo" />
      <Span data-id="foo" data-user="foo">
        ttest
      </Span>{' '}
      <Span data-id="bar" data-user="bar">
        ttest
      </Span>
      <Cursor data-user="bar" />
    </>
  )
}
