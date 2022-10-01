import { reconcile } from "./reconcile.js";

/**
 * Функция для обновления экземпляра
 * @param {Instance} internalInstance
 */

export function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  reconcile(parentDom, internalInstance, element);
}
