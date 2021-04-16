import {hues} from '@sanity/color'
import {Editor as PTEEditor} from 'react-pte'
import styled, {css} from 'styled-components'
import {multiply, screen} from './helpers'

const user1 = hues.blue
const user2 = hues.magenta

export const Editor = styled(PTEEditor)(({theme}) => {
  const blend = theme.sanity.color.dark ? screen : multiply

  return css`
    outline: none;

    &::selection,
    & ::selection {
      background: transparent;
    }

    & [data-users='foo'] {
      background: ${user1[100].hex};
      outline: 1px solid ${user1[600].hex};
    }

    & [data-users='foo,bar'],
    & [data-users='bar,foo'] {
      background: ${blend(user1[100].hex, user2[100].hex)};
      outline: 1px solid ${blend(user1[600].hex, user2[600].hex)};
    }

    & [data-users='bar'] {
      background: ${user2[100].hex};
      outline: 1px solid ${user2[600].hex};
    }
  `
})
