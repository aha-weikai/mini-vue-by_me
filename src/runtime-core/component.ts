import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHanlders } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const component = instance.type;

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHanlders);

  const { setup } = component;

  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function Object
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const component = instance.type;

  // 假设一定有 render
  instance.render = component.render;
}

let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
