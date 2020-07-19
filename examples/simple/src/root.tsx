import {Theme, ThemeProvider, studioTheme} from '@sanity/ui'
import React from 'react'
import Refractor from 'react-refractor'
import bash from 'refractor/lang/bash'
import javascript from 'refractor/lang/javascript'
import json from 'refractor/lang/json'
import jsx from 'refractor/lang/jsx'
import typescript from 'refractor/lang/typescript'
import {createGlobalStyle, css} from 'styled-components'
import {App} from './app'

Refractor.registerLanguage(bash)
Refractor.registerLanguage(javascript)
Refractor.registerLanguage(json)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(typescript)

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

export function Root() {
  return (
    <ThemeProvider theme={studioTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  )
}
