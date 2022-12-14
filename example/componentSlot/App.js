import { h, createTextVNode } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [h("p", {}, "age" + age), createTextVNode("你好呀")],
        footer: () => h("p", {}, "456"),
      }
    );
    return h("div", {}, [h("p", {}, "hi," + this.msg), foo]);
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
