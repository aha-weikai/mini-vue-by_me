import { ShapeFlags } from "../shared/shapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;
  // 判断是否是具有插槽的组件
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlot(children, instance.slots);
  }
}

function normalizeObjectSlot(children, slots) {
  for (const key in children) {
    const value = children[key];

    // {header: (age) => h("p", {}, "age" + age), }
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
