/**
 * Пример обычного компонента
 * @param {string | function} type Тип элемента
 * @param {Object} props Параметры компонента
 * @param {Array} props.children Массив вложенных элементов
 */

const Example = {
    type: "button",
    props: {
        id: "container",
        className: "awesome",
        onClick: () => console.log('click'),
        children: [
            // { type: "input", props: { value: "foo", type: "text" } },
            // { type: "a", props: { href: "/bar" } },
            { type: "span", props: { textContent: "button" } }
        ]
    }
};

export default Example
