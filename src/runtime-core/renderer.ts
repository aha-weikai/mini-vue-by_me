import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { createVNode, Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options;

  function render(vnode, container) {
    patch(vnode, container, null);
  }

  function patch(vnode: any, container: any, parentComponent) {
    // processElement()
    // 处理组件
    const { shapeFlag, type } = vnode;

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;

      case Text:
        processText(vnode, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }

  function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }

  function mountComponent(initialVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance: any, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement

    patch(subTree, container, instance);

    initialVNode.el = subTree.el;
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    const { children, props, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, val);
    }
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }
  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }

  return {
    createApp: createAppApi(render),
  };
}
