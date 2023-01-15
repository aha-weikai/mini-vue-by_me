import { h, ref } from "../../lib/guide-mini-vue.esm.js";

const nextChildren = "newChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return { isChange };
  },

  render() {
    const self = this;
    return self.isChange === false ? h("div", {}, prevChildren) : h("div", {}, nextChildren);
  },
};
