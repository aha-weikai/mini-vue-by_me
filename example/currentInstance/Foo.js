import { h,getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props) {
    const instance = getCurrentInstance();
    console.log("foo:", instance);
  },

  render() {
    return h("div", {}, "foo:");
  },
};
