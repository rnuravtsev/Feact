import { updateDomProperties } from "./updateDomProperties.js";
import { instantiate } from "./instantiate.js";

/**
 * Сверка и вставка в DOM VDOM-элемента
 * Направлен на повторное использование имеющихся узлов dom в максимально возможной степени
 * @param {HTMLElement} parentDom DOM-узел
 * @param {Instance} instance Предыдущий Impact-элемент
 * @param {Element} element Текущий Impact-элемент
 * @returns {Object}
 */
export function reconcile(parentDom, instance, element) {
  console.log('911.instance', instance);
  console.log('911.element', element);
  if (instance == null) {
    // Если нет предыдущего экземпляра, то создаём
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Удаляем экземпляр
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    // Заменяем старый DOM-узел новым
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === "string") {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }
}

/**
 * Функция для сверки дочерних узлов
 * @param instance Предыдущий экземпляр
 * @param element Текущий элемент
 * @return {*[]}
 */
export function reconcileChildren(instance, element) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance != null);
}
