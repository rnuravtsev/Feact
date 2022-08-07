import { TEXT_ELEMENT } from "./consts.js";
import { isAttribute, isEvent } from "./utils.js";

let rootInstance = null;

/**
 * Функция для отрисовки Impact-элемента в DOM.
 * Теперь мы сохраняем предыдущий элемент в переменной rootInstance.
 * @param element Impact-элемент
 * @param container DOM-узел куда будет отрисован Impact-элемент
 *
 */
function render(element, container = document.querySelector('#root')) {
  const prevInstance = rootInstance;
  rootInstance = reconcile(container, prevInstance, element);
}

/**
 * Сверка элементов
 * Создаёт экземпляр (и его дочерние элементы) для заданного элемента и вставляет в DOM
 * @param parentDom DOM-узел
 * @param instance Предыдущий Impact-элемент
 * @param element Текущий Impact-элемент
 */
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Создаём экземпляр
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Удаляем экземпляр
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type === element.type) {
    // Обновляем экземпляр
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    // Переставляем экземпляр
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

/**
 * Функция для создания экземпляра DOM-элемента на основе Impact-элемента
 * @param element Impact-элемент или DOM-элемент
 * @param container Dom-элемент в котором будет отрисован Impact-элемент
 * @return {Object} Impact-элемент
 */
function instantiate(element, container) {
  const { type, props } = element

  // Проверка на тип элемента
  const isTextNode = type === TEXT_ELEMENT

  // Создание DOM-элемента в зависимости от типа элемента
  const dom = isTextNode ? document.createTextNode('') : document.createElement(type)

  updateDomProperties(dom, [], props);

  const childElements = props.children || []
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  return { dom, element, childInstances };
}

/**
 * Функция для сверки дочерних узлов
 * @param instance Предыдущий экземпляр
 * @param element Текущий элемент
 * @return {*[]}
 */
function reconcileChildren(instance, element) {
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

/**
 * Функция для обновления свойств dom-элементов
 * @param dom DOM-узел
 * @param prevProps Предыдущие свойства
 * @param nextProps Новые свойства
 */
function updateDomProperties(dom, prevProps, nextProps) {
  // Удаляем обработчики события
  Object.keys(prevProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  // Удаляем атрибуты
  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    dom[name] = null;
  });

  // Добавляем атрибуты
  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    dom[name] = nextProps[name];
  });

  // Добавляем обработчики событий
  Object.keys(nextProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  });
}

export default render
