import {multiply as _multiply, parseColor, rgbToHex, screen as _screen} from '@sanity/ui'
import {Block, Node, Span} from 'pte'

export function block(name: string, ...children: Node[]): Block {
  return {type: 'block', name, children}
}

export function span(text: string): Span {
  return {type: 'span', text}
}

export function multiply(str1: string, str2: string) {
  const rgb1 = parseColor(str1)
  const rgb2 = parseColor(str2)

  return rgbToHex(_multiply(rgb1, rgb2))
}

export function screen(str1: string, str2: string) {
  const rgb1 = parseColor(str1)
  const rgb2 = parseColor(str2)

  return rgbToHex(_screen(rgb1, rgb2))
}
