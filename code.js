figma.showUI(__html__);
// function isRectangle(node: BaseNode): node is RectangleNode {
//   return node.type === "RECTANGLE";
// }
// function isVector(node: BaseNode): node is VectorNode {
//   return node.type === "VECTOR";
// }
// function isEllipse(node: BaseNode): node is EllipseNode {
//   return node.type === "ELLIPSE";
// }
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
const { selection } = figma.currentPage;
function removeMasks() {
    selection.length === 0 && figma.notify("Nothing selected!");
    selection.forEach((node) => {
        node.isMask && node.remove();
        for (const child of node.children) {
            child.isMask === false && figma.notify("No masks present");
            child.isMask && child.remove();
        }
        node.isMask === false && figma.notify("No masks present");
    });
    figma.notify("✅ Done!");
}
function removeStrokes() {
    selection.forEach((node) => {
        const strokes = clone(node.strokes);
        strokes[0].visible === false && strokes.splice(0, 1);
        node.strokes = strokes;
        if (node.children) {
            for (const child of node.children) {
                const childStrokes = clone(child.strokes);
                childStrokes[0].visible === false && childStrokes.splice(0, 1);
                child.strokes = childStrokes;
            }
        }
    });
    figma.notify("✅ Done!");
}
function removeFills() {
    selection.forEach((node) => {
        node.fills = node.children[0].fills;
        node.strokes = node.children[0].strokes;
        if (node.children[0].cornerRadius === figma.mixed) {
            node.topLeftRadius = node.children[0].topLeftRadius;
            node.bottomLeftRadius = node.children[0].bottomLeftRadius;
            node.topRightRadius = node.children[0].topRightRadius;
            node.bottomRightRadius = node.children[0].bottomRightRadius;
        }
        else if (node.children[0].cornerRadius !== figma.mixed) {
            node.cornerRadius = node.children[0].cornerRadius;
        }
        node.children[0].remove();
    });
    figma.notify("✅ Done!");
}
figma.ui.onmessage = (msg) => {
    if (msg.type === "rm-masks") {
        removeMasks();
    }
    if (msg.type === "rm-strokes") {
        removeStrokes();
    }
    if (msg.type === "fill-frame") {
        removeFills();
    }
    if (msg.type === "fix-all") {
        async function fixAll() {
            await removeMasks();
            await removeStrokes();
            await removeFills();
        }
        fixAll();
    }
};
