import { h, ref } from "../../lib/guide-mini-vue.esm.js";

import ArrayToText from "./ArrayToText.js";
// import ArrayToArray from "./ArrayToArray.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";

export const App = {
  name: "App",
  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // 老的array 新的text
      // h(ArrayToText),
      // 老的text 新的text
      // h(TextToText),
      // // 老的text 新的array
      h(TextToArray),
      // // 老的array 新的array
      // h(ArrayToArray),
    ]);
  },

  setup() {
    return {};
  },
};
