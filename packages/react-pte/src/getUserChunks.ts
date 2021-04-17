import {isCollapsed, PTSelection, SelectionMap, sortSelection} from 'pte'

export function getUserChunks(selections: SelectionMap, nodeOffset: number, text: string): any[] {
  const ret: any = []
  const textLength = text.length
  const textOffsets: number[] = [0]
  const selectionEntries = Object.entries(selections)
  const users: {id: string; start: number; end: number; selection: PTSelection}[] = []

  for (const [userId, selection] of selectionEntries) {
    if (selection) {
      const [anchor, focus] = sortSelection(selection)
      const startOffset = anchor[0] === nodeOffset && anchor[1]
      const endOffset = focus[0] === nodeOffset && focus[1]

      users.push({
        id: userId,
        start: typeof startOffset === 'number' ? startOffset : -1,
        end: typeof endOffset === 'number' ? endOffset : textLength + 1,
        selection,
      })

      if (typeof startOffset === 'number' && !textOffsets.includes(startOffset)) {
        textOffsets.push(startOffset)
      }

      if (typeof endOffset === 'number' && !textOffsets.includes(endOffset)) {
        textOffsets.push(endOffset)
      }
    }
  }

  if (!textOffsets.includes(textLength)) {
    textOffsets.push(textLength)
  }

  textOffsets.sort((a, b) => a - b)

  // console.log(users)
  // console.log(textOffsets)

  for (let i = 0; i < textOffsets.length - 1; i += 1) {
    const start = textOffsets[i]
    const end = textOffsets[i + 1]
    const chunk = text.slice(start, end)
    const _last = i === textOffsets.length - 2

    const startCursor = {
      type: 'cursor',
      userIds: [] as string[],
      // start,
      // end,
    }
    const t = {
      type: 'text',
      text: chunk,
      userIds: [] as string[],
    }
    const endCursor = {
      type: 'cursor',
      userIds: [] as string[],
      // start,
      // end,
    }

    for (const user of users) {
      const {focus} = user.selection
      const _collapsed = isCollapsed(user.selection)

      // if (start <= user.start && end >= user.end) {
      if (user.start <= start && end <= user.end) {
        // ret.push({type: 'text', text: chunk, userId: [user.id]})
        t.userIds.push(user.id)
      }

      // if (nodeOffset === focus[0] && start === focus[1]) {
      //   startCursor.userIds.push(user.id)
      // }

      if (_collapsed && start === focus[1]) {
        startCursor.userIds.push(user.id)
      }

      if ((_last || !_collapsed) && end === focus[1]) {
        endCursor.userIds.push(user.id)
      }
    }

    if (startCursor.userIds.length) {
      ret.push(startCursor)
    }

    // if (t.userIds.length) {
    ret.push(t)
    // }

    if (endCursor.userIds.length) {
      ret.push(endCursor)
    }

    // console.log('chunk', chunk)
  }

  return ret
}
