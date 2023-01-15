import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        id: "root",
        onClick() {
          console.log("click");
        },
      },
      [h("p", {}, "count:" + this.count), h("button", { onClick: this.onClick }, "click")]
    );
  },

  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };
    return {
      msg: "mini-vue",
      onClick,
      count,
    };
  },
};
