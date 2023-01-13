import { createVNode } from "./vnode";

// render
export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // rootComponent => vnode
        // 所有的逻辑操作都基于 vnode 处理

        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
