import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { createVNode, Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    //
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null, null);
  }

  /**
   * @param n1 老的节点
   * @param n2 新的节点
   */
  function patch(n1, n2: any, container: any, parentComponent, anchor) {
    // processElement()
    // 处理组件
    const { shapeFlag, type } = n2;

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;

      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processComponent(n1, n2: any, container: any, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function mountComponent(initialVNode: any, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(instance: any, initialVNode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance, anchor);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;

        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      // init
      mountElement(n2, container, parentComponent, anchor);
    } else {
      // update
      patchElement(n1, n2, parentComponent, patchChildren, anchor);
    }
  }

  function patchElement(n1, n2, container, patchChildren, anchor) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const el = (n2.el = n1.el);
    // props
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    // n2.el 没值，因为 n2 是新节点，el 为 null，只有进行 mountElement 才会为 el 赋值
    // n1 是旧的 vnode，是被 init 的，所以有 el
    // 所以 需要为 n2.el 赋值
    patchProps(el, oldProps, newProps);
    // children
    patchChildren(n1, n2, el, patchChildren, anchor);
  }

  function patchChildren(n1, n2, container, patchChildren, anchor) {
    const { shapeFlag } = n2;
    const prevShapeFlag = n1.shapeFlag;
    const c2 = n2.children;
    const c1 = n1.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // new is text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children, c2);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // new is array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, patchChildren, anchor);
      } else {
        // array to array
        patchKeyedChildren(c1, c2, container, patchChildren, anchor);
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    // 从左侧开始对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    // 从右侧开始对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 新的比老的多，需要进行创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 老的比新的长
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      // 乱序
    }
  }

  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }

  function unmountChildren(children, el) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      // remove
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    const { children, props, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor);
    }

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }
  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children.children, container, parentComponent, anchor);
  }

  return {
    createApp: createAppApi(render),
  };
}
