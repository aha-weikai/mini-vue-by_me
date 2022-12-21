import { extend } from "../shared";

let activeEffect;
let shouldTrack;

export class ReactiveEffect {
  private _fn: any;
  public scheduler: any;
  deps = [];
  active: boolean = true; // true：代表函数被收集  false：代表函数从依赖中被清除
  onStop: any;
  constructor(_fn, scheduler) {
    this._fn = _fn;
    this.scheduler = scheduler;
  }

  run() {
    // 返回客户端函数的执行的返回值
    // 1. 调用函数时候，会触发收集依赖
    //    shouldTrack 来做区分

    if (!this.active) {
      // 函数从依赖中被清除，需要重新收集
      return this._fn();
    }

    // 第一次触发
    shouldTrack = true; // 可被收集
    activeEffect = this;
    const result = this._fn();

    // reset
    shouldTrack = false;

    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
  // 实际上 effect 已经没有引用了，会被回收
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  // options
  // extend
  extend(_effect, options);
  _effect.onStop = options.onStop;
  _effect.run();

  // 返回runner，实际上_effect.run，
  // 由于此处涉及到指针，所以使用bind修正指针指向
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

const targetMap = new Map();
/**
 * @description 收集依赖
 */
// 所有依赖(Map) -> target(Map) -> key(Set -> effectFns)
export function track(target, key) {
  // 判断是否是 通过 effect 注册函数触发响应式对象的 get 拦截函数，触发track。
  if (!isTracking()) return;

  // 1. 获取 target 对应的 deps
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 第一次没有
    // 如果没有，就初始化 depsMap
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 2. 获取 target.key 对应的 deps
  let deps: Set<Function> | undefined = depsMap.get(key);
  if (!deps) {
    // 第一次没有
    // 如果没有，就初始化 deps(Set)
    deps = new Set();
    depsMap.set(key, deps);
  }
  trackEffects(deps);
}

export function trackEffects(deps) {
  // 只有使用effect注册副作用函数时，从 effect.run() 中进入，才能够向下执行
  if (deps.has(activeEffect)) return;

  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

/**
 * @description 判断是否是 通过 effect 注册函数触发响应式对象的 get 拦截函数，触发track。
 */

export function isTracking() {
  // 如果没有正在执行的函数，return
  // 通过 obj.foo++ 这样的操作进入 get 拦截函数，触发track
  // 如果不是从 effect.run() 中进入，return
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  triggerEffects(deps);
}

export function triggerEffects(deps) {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  runner.effect.stop();
}
