import { h } from "../../lib/guide-mini-vue.esm.js";
export const App = {
  render() {
    return h("div", {}, [h("p", {}, "hi," + this.msg), h("p", {}, "hi,mini-vue")]);
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
