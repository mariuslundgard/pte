export function createMockSelection(): Selection {
  const _sel = {
    anchorNode: null,
    anchorOffset: null,
    focusNode: null,
    focusOffset: null,
    setBaseAndExtent,
  }

  function setBaseAndExtent(b0: any, b1: any, e0: any, e1: any) {
    _sel.anchorNode = b0
    _sel.anchorOffset = b1
    _sel.focusNode = e0
    _sel.focusOffset = e1
  }

  return _sel as any
}
