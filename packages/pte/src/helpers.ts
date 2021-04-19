import {PTNode, NodeMetadata, Location, PTSelection} from './types'

export function createId(): string {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart = ((Math.random() * 46656) | 0).toString(36)
  let secondPart = ((Math.random() * 46656) | 0).toString(36)

  firstPart = ('000' + firstPart).slice(-3)
  secondPart = ('000' + secondPart).slice(-3)

  return firstPart + secondPart
}

export function buildTree(nodes: NodeMetadata[], depth = 0): PTNode[] {
  const tree: PTNode[] = []

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.depth === depth) {
      const newNode: PTNode =
        node.type === 'span'
          ? {
              ...node.data,
              type: 'span',
              key: node.key || '',
              text: node.text,
            }
          : {
              ...node.data,
              type: 'block',
              key: node.key || '',
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
      const {type, key, text, ...data} = node

      return acc.concat([{type, key, data, depth, size: getNodeSize(node), text}])
    } else {
      const {type, key, name, children, ...data} = node

      return acc.concat(
        [{type, key, name, data, depth, size: getNodeSize(node)}],
        ...getTreeMetadata(children, depth + 1)
      )
    }
  }, [])
}

export function isBackwardSelection(sel: PTSelection): boolean {
  return (
    sel.focus[0] < sel.anchor[0] || (sel.focus[0] === sel.anchor[0] && sel.focus[1] < sel.anchor[1])
  )
}

export function sortSelection(keys: string[], sel: PTSelection): [Location, Location] {
  const anchorOffset = keys.indexOf(sel.anchor[0])
  const focusOffset = keys.indexOf(sel.focus[0])

  if (
    anchorOffset > focusOffset ||
    (anchorOffset === focusOffset && sel.anchor[1] > sel.focus[1])
  ) {
    return [sel.focus, sel.anchor]
  }

  return [sel.anchor, sel.focus]
}

export function isDOMElement(value: unknown): value is Element {
  return value instanceof Node && value.nodeType === Node.ELEMENT_NODE
}

export function getDOMSelection(domSelection: Selection | null): PTSelection | null {
  // const sel = window.getSelection()

  if (!domSelection) return null

  let anchorNode = domSelection.anchorNode

  if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
    anchorNode = anchorNode.parentNode
  }

  let focusNode = domSelection.focusNode

  if (focusNode && focusNode.nodeType === Node.TEXT_NODE) {
    focusNode = focusNode.parentNode
  }

  if (!isDOMElement(anchorNode) || !isDOMElement(focusNode)) {
    return null
  }

  const anchorNodeKey = anchorNode.getAttribute('data-key') || ''
  const anchorChunkOffset = Number(anchorNode.getAttribute('data-chunk-offset')) || 0
  const focusNodeKey = focusNode.getAttribute('data-key') || ''
  const focusChunkOffset = Number(focusNode.getAttribute('data-chunk-offset')) || 0

  return {
    anchor: [anchorNodeKey, anchorChunkOffset + domSelection.anchorOffset],
    focus: [focusNodeKey, focusChunkOffset + domSelection.focusOffset],
  }
}

export function getDOMNodeAtOffset(el: Element, loc: Location): {node: Element; offset: number} {
  const [nodeKey, offset] = loc
  const textSpans = Array.from(el.querySelectorAll(`[data-text][data-key="${nodeKey}"]`))

  textSpans.reverse()

  for (const node of textSpans) {
    const chunkOffset = Number(node.getAttribute('data-chunk-offset') || -1)
    const chunkLength = Number(node.getAttribute('data-chunk-length') || -1)

    const start = chunkOffset
    const end = chunkOffset + chunkLength

    if (start <= offset && offset <= end) {
      return {node, offset: offset - chunkOffset}
    }
  }

  throw new Error(`not found: ${JSON.stringify(loc)}`)
}

export function isCollapsed(sel: PTSelection): boolean {
  return sel.anchor[0] === sel.focus[0] && sel.anchor[1] === sel.focus[1]
}

export function setDOMSelection(
  domSelection: Selection,
  start: {node: Node; offset: number},
  end: {node: Node; offset: number}
): boolean {
  const startNode = start.node.firstChild
  const endNode = end.node.firstChild

  if (startNode instanceof Node && endNode instanceof Node) {
    domSelection.setBaseAndExtent(startNode, start.offset, endNode, end.offset)

    return true
  }

  return false
}
