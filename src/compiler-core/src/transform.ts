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

  const exitFns: any = [];
  for (const transform of nodeTransforms) {
    const onExit = transform(node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
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

  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
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
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode;
  } else {
    root.codegenNode = root.children[0];
  }
}
