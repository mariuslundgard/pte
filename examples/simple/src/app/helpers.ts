import {multiply as _multiply, parseColor, rgbToHex, screen as _screen} from '@sanity/ui'
import {createId, PTBlock, PTNode, PTSpan} from 'pte'

export function block(name: string, ...children: PTNode[]): PTBlock {
  return {type: 'block', key: createId(), name, children}
}

export function span(text: string): PTSpan {
  return {type: 'span', key: createId(), text}
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
