import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h("div", {}, [h("p", {}, "hi," + this.msg), h(Foo, {}, [h("p", {}, "123")])]);
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
