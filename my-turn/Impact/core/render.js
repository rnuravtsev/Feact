import { reconcile } from "./reconcile.js";

let rootInstance = null;
/**
 * Функция для отрисовки Impact-элемента в DOM.
 * Теперь мы сохраняем предыдущий элемент в переменной rootInstance.
 * @param {Element} element Impact-элемент
 * @param {HTMLElement} container DOM-узел куда будет отрисован Impact-элемент
 *
 */
function render(element, container = document.querySelector('#root')) {
  const prevInstance = rootInstance;
  rootInstance = reconcile(container, prevInstance, element);
}

export default render
