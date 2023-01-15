import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        id: "root",
        ...this.props,
      },
      [
        h("p", {}, "count:" + this.count),
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
        h(
          "button",
          {
            onClick: this.onChangePropsDemo1,
          },
          "foo -> new-foo"
        ),
        h(
          "button",
          {
            onClick: this.onChangePropsDemo2,
          },
          "foo -> undefined"
        ),
        h(
          "button",
          {
            onClick: this.onChangePropsDemo3,
          },
          "bar -> disappear"
        ),
      ]
    );
  },

  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    const onChangePropsDemo1 = () => {
      props.value.foo = "new-foo";
    };

    const onChangePropsDemo2 = () => {
      props.value.foo = undefined;
    };

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: "no-bar",
      };
    };

    return {
      msg: "mini-vue",
      onClick,
      count,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    };
  },
};
