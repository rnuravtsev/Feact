/**
 * Функция для создания полноценного компонента
 * @param {Element} element ImpactElement
 * @param {Instance} internalInstance
 * @return {PublicInstance}
 */

export function createPublicInstance(element, internalInstance) {
  const { type, props } = element;
  const publicInstance = new type(props);
  publicInstance.__internalInstance = internalInstance;
  console.log('911.publicInstance', publicInstance);
  return publicInstance;
}
