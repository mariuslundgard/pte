import {PTNode, NodeMetadata, Location, PTSelection} from './types'

export function buildTree(nodes: NodeMetadata[], depth = 0): PTNode[] {
  const tree: PTNode[] = []

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.depth === depth) {
      const newNode: PTNode =
        node.type === 'span'
          ? {
              type: 'span',
              ...node.data,
              text: node.text,
            }
          : {
              type: 'block',
              ...node.data,
              name: node.name,
              children: buildTree(nodes.slice(i + 1), depth + 1),
            }

      tree.push(newNode)
    }

    if (node.depth < depth) {
      return tree
    }
  }

  return tree
}

export function getNodeSize(node: PTNode): number {
  if (node.type === 'span') return 0

  return node.children.reduce((acc, x) => acc + getNodeSize(x), node.children.length)
}

export function getTreeMetadata(treeNodes: PTNode[], depth = 0): NodeMetadata[] {
  return treeNodes.reduce((acc: NodeMetadata[], node) => {
    if (node.type === 'span') {
      const {type, text, ...data} = node

      return acc.concat([{type, data, depth, size: getNodeSize(node), text}])
    }

    const {type, name, children, ...data} = node

    return acc.concat(
      [{type, name, data, depth, size: getNodeSize(node)}],
      ...getTreeMetadata(children, depth + 1)
    )
  }, [])
}

export function sortSelection(sel: PTSelection): [Location, Location] {
  if (
    sel.anchor[0] > sel.focus[0] ||
    (sel.anchor[0] === sel.focus[0] && sel.anchor[1] > sel.focus[1])
  ) {
    return [sel.focus, sel.anchor]
  }

  return [sel.anchor, sel.focus]
}

export function isDOMElement(value: unknown): value is Element {
  return value instanceof Node && value.nodeType === Node.ELEMENT_NODE
}

export function getDOMSelection(): PTSelection | null {
  const sel = window.getSelection()

  if (!sel) return null

  let anchorNode = sel.anchorNode

  if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
    anchorNode = anchorNode.parentNode
  }

  let focusNode = sel.focusNode

  if (focusNode && focusNode.nodeType === Node.TEXT_NODE) {
    focusNode = focusNode.parentNode
  }

  if (!isDOMElement(anchorNode) || !isDOMElement(focusNode)) {
    return null
  }

  const anchorOffset = Number(anchorNode.getAttribute('data-offset')) || 0
  const anchorChunkOffset = Number(anchorNode.getAttribute('data-chunk-offset')) || 0
  const focusOffset = Number(focusNode.getAttribute('data-offset')) || 0
  const focusChunkOffset = Number(anchorNode.getAttribute('data-chunk-offset')) || 0

  return {
    anchor: [anchorOffset, anchorChunkOffset + sel.anchorOffset],
    focus: [focusOffset, focusChunkOffset + sel.focusOffset],
  }
}

export function getDOMNodeAtOffset(el: Element, loc: Location): [globalThis.Element, number] {
  console.log('getDOMNodeAtOffset', loc)

  const textSpans = Array.from(el.querySelectorAll(`[data-type="text"][data-offset="${loc[0]}"]`))

  const metadataArr = textSpans.map((textSpan) => {
    const chunkOffset = Number(textSpan.getAttribute('data-chunk-offset') || -1)
    const chunkLength = Number(textSpan.getAttribute('data-chunk-length') || -1)

    return {
      node: textSpan,
      chunkLength,
      chunkOffset,
    }
  })

  if (metadataArr.length > 0) {
    const m = metadataArr[0]

    return [m.node, loc[1] - m.chunkOffset]
  }

  throw new Error('not found')
}

export function isCollapsed(sel: PTSelection): boolean {
  return sel.anchor[0] === sel.focus[0] && sel.anchor[1] === sel.focus[1]
}
