class ReactiveEffect {
  private _fn: any;
  constructor(_fn) {
    this._fn = _fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();

  return _effect.run.bind(_effect);
}

const targetMap = new Map();
/**
 * @description 收集依赖
 */
let activeEffect;

// 所有依赖(Map) -> target(Map) -> key(Set -> effectFns)
export function track(target, key) {
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

  deps.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for (const effect of deps) {
    effect.run();
  }
}
