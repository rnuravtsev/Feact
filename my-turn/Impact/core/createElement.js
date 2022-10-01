import { TEXT_ELEMENT } from "./consts.js";

/**
 * Функция для создания элементов
 * @param {string|{}} type
 * @param {{}} config - props
 * @param args - Children
 * @return {{type, props: *}}
 */

export function createElement(type, config = {}, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren
    .filter(children => children !== null && children !== false)
    .map(children => children instanceof Object ? children : createTextElement(children));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}
