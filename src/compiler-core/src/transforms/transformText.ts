import { NodeTypes } from "../ast";
import { isText } from "../utils";

export function transformText(node) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { children } = node;
      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        // 如果此节点 n1 是 可以拼接的类型 文本类型或者插槽类型
        // 则检查下一个节点 n2 是否也是可以拼接的类型
        // 如果是，则创建一个容器节点，向它的children 添加 n1,n2
        // 且 将 容器节点赋值给 n1
        // n1 为组合类型节点
        // 如果后面的节点仍为 可以拼接的类型
        // 则继续向 容器节点(n1) 的children 中添加
        // 如果不是，先将之前的保存容器节点的变量赋值为 undefined，继续循环
        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }
              currentContainer.children.push(" + ");
              currentContainer.children.push(next);
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = undefined;
              break;
            }
          }
        }
      }
    };
  }
}
