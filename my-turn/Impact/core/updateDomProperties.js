import { isAttribute, isEvent } from "./utils.js";

/**
 * Функция для обновления свойств dom-элементов
 * @param {HTMLElement} dom DOM-узел
 * @param {{}} prevProps Предыдущий конфиг
 * @param {{}} nextProps Новый конфиг
 */
export function updateDomProperties(dom, prevProps, nextProps) {
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
