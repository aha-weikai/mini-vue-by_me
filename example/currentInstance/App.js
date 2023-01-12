import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        onClick() {
          console.log("click");
        },
      },
      [h("p", {}, "hi," + this.msg), h(Foo, { count: 1 }), h("p", {}, "currentInstance demo")]
    );
  },

  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
    return {
      msg: "mini-vue",
    };
  },
};
