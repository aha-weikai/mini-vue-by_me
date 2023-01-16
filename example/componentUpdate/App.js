import { h, ref } from "../../lib/guide-mini-vue.esm.js";
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
      [
        h("p", {}, "你好"), //
        h("button", { onClick: this.changeChildProps }, "change child props"),
        h(Foo, { msg: this.msg }, "hi,foo"),
        h("button", { onClick: this.changeCount }, "change self count"),
        h("p", {}, "count:" + this.count),
      ]
    );
  },

  setup() {
    const msg = ref("123");
    const count = ref(1);

    window.msg = msg;

    const changeChildProps = () => {
      msg.value = "456";
    };

    const changeCount = () => {
      count.value++;
    };

    return {
      msg,
      count,
      changeChildProps,
      changeCount,
    };
  },
};
