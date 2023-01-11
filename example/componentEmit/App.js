import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h("div", {}, [
      h("p", {}, "hi," + this.msg),
      h(Foo, {
        onAdd(a, b) {
          console.log("onAdd");
          console.log(a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        },
      }),
      h("p", {}, "hi,mini-vue"),
    ]);
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
