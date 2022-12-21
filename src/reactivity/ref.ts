import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

// 如果ref的值为原始值， 无法通过proxy去拦截操作
// 通过对象的 getter 和setter 拦截操作

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value) {
    // 如果value是 object ，则使用reactive包裹
    // 当 value里面的属性发生改变时，走的是reactive的触发副作用函数
    // 当 value的地址发生变化， 走的是ref的触发副作用函数
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 先修改了value 的值

    // hasChanged
    if (!hasChanged(this._rawValue, newValue)) return;
    this._rawValue = newValue;
    this._value = convert(newValue);
    triggerEffects(this.dep);
  }
}

/**
 * @description 转换
 */
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  // ref 对象返回 ref.value
  // 否则直接返回
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },

    set(target, key, value) {
      // set -> ref .value
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
