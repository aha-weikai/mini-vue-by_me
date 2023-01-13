import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const Provider = {
  name: "Provider",
  render() {
    return h(
      "div",
      {
        onClick() {
          console.log("click");
        },
      },
      [h("p", {}, "hi," + this.msg), h(ProviderTwo)]
    );
  },

  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
    return {
      msg: "mini-vue",
    };
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  render() {
    return h("div", {}, [h("p", {}, "hi," + this.msg + " --- " + this.foo), h(Consumer)]);
  },

  setup() {
    provide("foo", "fooTwo");
    const foo = inject("foo");
    return {
      foo,
      msg: "ProviderTwo",
    };
  },
};

const Consumer = {
  name: "Consumer",
  render() {
    return h(
      "div",
      {
        onClick() {
          console.log("click");
        },
      },
      `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`
    );
  },

  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", "defaultBaz");
    return {
      foo,
      bar,
    };
  },
};
