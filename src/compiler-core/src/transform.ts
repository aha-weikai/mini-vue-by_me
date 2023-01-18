import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  const context = createTransformContext(root, options);

  // 1. 遍历 - 深度优先搜索
  traverseNode(root, context);

  // root.codegenNode
  createRootCodegen(root);

  root.helpers = [...context.helpers.keys()];
}
function traverseNode(node: any, context) {
  const nodeTransforms = context?.nodeTransforms || [];

  for (const transform of nodeTransforms) {
    transform(node);
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;

    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, context);

      break;
    default:
      break;
  }
}
function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options?.nodeTransforms || [],
    helper(key) {
      context.helpers.set(key, 1);
    },
    helpers: new Map(),
  };
  return context;
}

function traverseChildren(node, context) {
  const children = node.children;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
