import { isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

function createGetter(isReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    // res 是否是 object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

const get = createGetter();
const set = createSetter();
export const mutableHandlers = {
  get,
  set,
};

const readonlyGet = createGetter(true);
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`key:${key} set 失败，因为 target 是 readonly`, target);
    return true;
  },
};
