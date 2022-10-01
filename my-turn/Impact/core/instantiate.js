import { TEXT_ELEMENT } from "./consts.js";
import { createPublicInstance } from "./createPublicInstance.js";
import { updateDomProperties } from "./updateDomProperties.js";

/**
 * Функция для создания экземпляра DOM-элемента на основе Impact-элемента
 * @param {Element} element Impact-элемент или DOM-элемент
 * @return {Instance} VDOM элемент
 */
export function instantiate(element) {
  const { type, props } = element;
  const isDomElement = typeof type === "string";

  if (isDomElement) {
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    updateDomProperties(dom, [], props);

    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    return { dom, element, childInstances };
  } else {
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    Object.assign(instance, { dom, element, childInstance, publicInstance });
    return instance;
  }
}
