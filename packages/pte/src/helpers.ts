import {Node, NodeMetadata, Location, Selection} from './types'

export function buildTree(nodes: NodeMetadata[], depth = 0): Node[] {
  const tree: Node[] = []

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.depth === depth) {
      const newNode: Node =
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

export function getNodeSize(node: Node): number {
  if (node.type === 'span') return 0

  return node.children.reduce((acc, x) => acc + getNodeSize(x), node.children.length)
}

export function getTreeMetadata(treeNodes: Node[], depth = 0): NodeMetadata[] {
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

export function sortSelection(sel: Selection): [Location, Location] {
  if (
    sel.anchor[0] > sel.focus[0] ||
    (sel.anchor[0] === sel.focus[0] && sel.anchor[1] > sel.focus[1])
  ) {
    return [sel.focus, sel.anchor]
  }

  return [sel.anchor, sel.focus]
}

export function isDOMElement(node: globalThis.Node): node is Element {
  if (node.nodeType === Node.ELEMENT_NODE) return true

  return false
}

export function getDOMSelection(): Selection | null {
  const sel = window.getSelection()

  if (!sel) return null

  const anchorNode = sel.anchorNode && sel.anchorNode.parentNode
  const focusNode = sel.focusNode && sel.focusNode.parentNode

  if (!anchorNode || !focusNode || !isDOMElement(anchorNode) || !isDOMElement(focusNode)) {
    return null
  }

  const anchorOffset = Number(anchorNode.getAttribute('data-offset'))
  const anchorChunkOffset = Number(anchorNode.getAttribute('data-chunk-offset') || 0)
  const focusOffset = Number(focusNode.getAttribute('data-offset'))
  const focusChunkOffset = Number(focusNode.getAttribute('data-chunk-offset') || 0)

  return {
    anchor: [anchorOffset, anchorChunkOffset + sel.anchorOffset],
    focus: [focusOffset, focusChunkOffset + sel.focusOffset],
  }
}

export function getDOMNodeAtOffset(el: Element, loc: Location): [globalThis.Element, number] {
  const matches = Array.from(el.querySelectorAll(`[data-offset="${loc[0]}"]`)).map((node) => {
    const chunkOffset = Number(node.getAttribute('data-chunk-offset') || -1)

    return {
      node,
      chunkOffset,
      length:
        chunkOffset === -1
          ? -1
          : (node.firstChild && node.firstChild.nodeValue && node.firstChild.nodeValue.length) || 0,
    }
  })

  const match = matches.find((m) => {
    return m.chunkOffset === loc[1]
  })

  if (!match) throw new Error('not found')

  return [match.node, loc[1] - match.chunkOffset]
}

export function isCollapsed(sel: Selection): boolean {
  return sel.anchor[0] === sel.focus[0] && sel.anchor[1] === sel.focus[1]
}
