import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props, { emit }) {
    return {};
  },

  render() {
    const foo = h("p", {}, "foo");

    // 获取到Foo .node .children
    console.log(this.$slots);
    // 具名插槽
    // 1. 获取到要渲染的元素
    // 2. 获取到渲染的位置

    return h("div", {}, [renderSlots(this.$slots, "header"), foo, renderSlots(this.$slots, "footer")]);
  },
};
