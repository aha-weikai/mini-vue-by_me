export const extend = Object.assign;

export const EMPTY_OBJ = {};

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const isString = (val) => typeof val === "string";

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
};

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const toHandlerKey = (str: string) => (str ? "on" + capitalize(str) : "");
