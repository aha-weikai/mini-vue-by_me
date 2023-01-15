import { h, ref } from "../../lib/guide-mini-vue.esm.js";

// 1. 左侧的对比
// (a b) c
// (a b) d e
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
// ];

// 2. 右侧的对比
// a (b c)
// d e (b c)
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "D" }, "D"), //
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];

// 3. 新的比老的长
// 左侧
// (a b)
// (a b) c
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// 右侧
// (a b)
// c (a b)
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
// ];

// 4. 老的比新的长
// 左侧
// (a b) c
// (a b)
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
// ];
// 右侧
// (a b) c
// (b c)
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];

// 5. 对比中间的部分
// 删除老的 (在老的里面存在，新的里面不存在)
// 5.1
// a,b,(c,d),f,g
// a,b,(e,c),f,g
// const prevChildren = [
//   h("div", { key: "A" }, "A"), //
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C", id: "c-prev" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"), //
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "C", id: "c-next" }, "C"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];
// 5.1.1
// a,b,(c,e,d),f,g
// a,b,(e,c),f,g
const prevChildren = [
  h("div", { key: "A" }, "A"), //
  h("div", { key: "B" }, "B"),
  h("div", { key: "C", id: "c-prev" }, "C"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "F" }, "F"),
  h("div", { key: "G" }, "G"),
];
const nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"), //
  h("div", { key: "E" }, "E"),
  h("div", { key: "C", id: "c-next" }, "C"),
  h("div", { key: "F" }, "F"),
  h("div", { key: "G" }, "G"),
];

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
