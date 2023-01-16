import { h, ref, getCurrentInstance, nextTick } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  render() {
    return h("div", { id: "root" }, [h("p", {}, "count:" + this.count), h("button", { onClick: this.onClick }, "update")]);
  },

  setup() {
    const count = ref(0);
    const onClick = () => {
      console.log("onClick");
      for (let index = 0; index < 100; index++) {
        count.value++;
        console.log(count.value);
      }
    };

    nextTick(() => {
      console.log(getCurrentInstance());
    });

    // await nextTick()

    return {
      msg: "mini-vue",
      onClick,
      count,
    };
  },
};
