import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "is_reactive",
  IS_READONLY = "is_readonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}

function createActiveObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
