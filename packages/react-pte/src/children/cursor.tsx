import React from 'react'

export function Cursor({chunk}: {chunk: any}): React.ReactElement {
  return <span data-cursor="" data-users={chunk.userIds.join(',')} />
}
