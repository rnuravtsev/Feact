import render from "../core/render.js";
import List from "./List.js";

/**
 * Пример Impact-элемента
 * @param {string | function} type Тип элемента
 * @param {Object} props Параметры компонента
 * @param {Array} props.children Массив вложенных элементов
 */
const Example = {
    type: "button",
    props: {
        id: "container",
        className: "awesome",
        onClick: (e) => {
            render(List)
        },
        children: [
            // { type: "input", props: { value: "foo", type: "text" } },
            // { type: "a", props: { href: "/bar" } },
            { type: "span", props: { textContent: 'text' } }
        ]
    }
};

export default Example
