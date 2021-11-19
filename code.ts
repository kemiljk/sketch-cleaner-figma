const { selection } = figma.currentPage;

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

async function removeMasks() {
  selection.length === 0 && figma.notify("Nothing selected!");
  selection.forEach((node: any) => {
    node.isMask && node.remove();
    for (const child of node.children) {
      child.isMask === true && child.remove();
    }
    figma.notify("✅ Masks removed!");
  });
}

async function removeStrokes() {
  selection.forEach((node: any) => {
    const strokes = clone(node.strokes);
    strokes[0].visible === false && strokes.splice(0, 1);
    node.strokes = strokes;
    figma.notify("✅ Strokes deleted!");
  });
}

async function fixFills() {
  selection.forEach((node: any) => {
    node.fills = node.children[0].fills;
    node.strokes = node.children[0].strokes;
    if (node.children[0].cornerRadius === figma.mixed) {
      node.topLeftRadius = node.children[0].topLeftRadius;
      node.bottomLeftRadius = node.children[0].bottomLeftRadius;
      node.topRightRadius = node.children[0].topRightRadius;
      node.bottomRightRadius = node.children[0].bottomRightRadius;
    } else if (node.children[0].cornerRadius !== figma.mixed) {
      node.cornerRadius = node.children[0].cornerRadius;
    }
    node.children[0].remove();
    figma.notify("✅ Frame filled and old rectangle background removed!");
  });
}

removeMasks()
  .then(() => {
    fixFills();
  })
  .then(() => {
    removeStrokes();
  })
  .finally(() => {
    figma.closePlugin("✅ All finished!");
  });
