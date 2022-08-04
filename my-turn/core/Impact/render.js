/**
 * Функция для отрисовки элемента в DOM
 * @param element Impact-элемент или DOM-элемент
 * @param container В какой Dom-элемент хотим отрисовать Impact-элемент
 */
function render(element, container) {
    const { type, props } = element

    // Проверка на тип элемента
    const isTextNode = type === 'TEXT ELEMENT'

    // Генерация элемента
    const dom = isTextNode ? document.createTextNode('') : document.createElement(type)

    // Добавляем нативные обработчики
    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(event => {
        const eventType = event.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[event])
    })

    // Добавляем нативные атрибуты
    const isAttribute = name => !isListener(name) && name !== "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name];
    });

    const childElements = props.children || {}

    if (childElements.length) {
        childElements.forEach(el => render(el, dom))
    }

    container.appendChild(dom)
}

export default render
