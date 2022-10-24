const root = document.querySelector('#root')

const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT'

/**
 * Всевозможные типы элемента Mew
 * @typedef {string | HTMLElement | Class} ElementType
 */

/**
 * Элемент Mew
 * @typedef {{}} Element
 * @property {ElementType} type
 * @property {{}} props - конфиг
 * @property {Element[] | []} props.children - дети
 */

/**
 * Полноценная сущность в виде экземпляра (без локального состояния)
 * Любой элемент преобразуется в Инстанс, это нужно для оптимальной работы с DOM
 * @typedef {{}} Instance — экземпляр Mew
 * @property {HTMLElement} dom — ссылка на предыдущую DOM-ноду
 * @property {Element} element — текущий элемент
 * @property {Instance[]} childInstances — экземпляры-дети
 * */

/**
 * Экземпляр унаследованный от базового класса Component (с локальным состоянием)
 * @typedef {{}} PublicInstance
 * @property {HTMLElement} dom — ссылка на DOM
 * @property {Element} element — текущий элемент
 * @property {Class} publicInstance — объявленный класс с наследуемыми методами от класса Component
 * @property {Class} publicInstance.__internalInstance — предыдущее состояние publicInstance, чтобы можно
 * было обновлять DOM локально
 * @property {Instance} childInstance — текущий инстанс
 */

/**
 * Главная функция для создания элемента
 * Обрабатывает как элементы с заданным типом (с html-тегом или class), так и без (строчные)
 * @param {ElementType} type тип Mew
 * @param {{}} config пропсы Mew
 * @param {*} args дочерние элементы Mew
 * @return Element
 */
const createElement = (type, config = {}, ...args) => {
    const props = { ...config }

    props.children = args.map(el => el instanceof Object ? el : createTextElement(el))

    return { type, props }
}
/**
 * Функция для создания текстовых DOM-узлов
 * @param {string} value
 * @return Element
 */
const createTextElement = (value) => {
    return createElement(TEXT_ELEMENT_TYPE, { nodeValue: value })
}

/**
 * Функция для создания экземпляра компонента
 * @param {Class} element
 * @param {{}} internalInstance — пустой объект
 * @return {*}
 */
const createPublicInstance = (element, internalInstance) => {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
}

/**
 * Входная точка приложения
 * Отрабатывает единожды, при инициализации DOM-дерева для корневого элемента приложения
 * До внедрения локального состояния, это был единственный способ обновить состояние (повторный вызов рендер функций)
 * @param {Element} element
 * @param {HTMLElement} parent
 */
const render = (element, parent = root) => {
    reconcile(parent, null, element)
}

/**
 * Основная функция react
 * Reconcilation — сверка
 * Сверка предыдущего экземпляра с текущим и обновление/вставка в DOM
 * Алгоритм при котором достигается быстрая работа приложений (а именно работа с DOM), написанных на react
 * Основная цель — максимально избегать создания или удаления экземпляров
 * @param {ParentNode} container
 * @param {Instance | PublicInstance} prev предыдущий экземпляр
 * @param {Element} next текущий элемент
 */
const reconcile = (container, prev, next) => {
    if (prev === null) {
        const newInstance = instantiate(next)
        container.appendChild(newInstance.dom)
        return newInstance
    } else if (next === null) {
        container.removeChild(prev.dom)
        return null
    } else if (prev.element.type !== next.type) {
        const newInstance = instantiate(next)
        container.replaceChild(newInstance.dom, prev.dom)
        return newInstance
    } else if (typeof next.type === 'string') {
        updateDomProperties(prev.dom, prev.element.props, next.props)
        prev.childInstances = reconcileChildren(prev, next)
        prev.element = next
        return prev
    } else {
        prev.element.props = next.props
        const childElement = prev.publicInstance.render();
        const oldChildInstance = prev.childInstance;
        const childInstance = reconcile(container, oldChildInstance, childElement);
        prev.dom = childInstance.dom;
        prev.childInstance = childInstance;
        prev.element = next;
        return prev;
    }
}

/**
 * Функция для сверки дочерних элементов
 * @param {Instance} instance — предыдущий экземпляр
 * @param {Element} element  — текущий элемент
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

    return newChildInstances.filter(instance => instance !== null)
}

/**
 * Преобразование элемента в экземпляр.
 * Экземпляр имеет своё состояние, и хранит ссылку на предыдущее состояние DOM ноды
 * @param {Element} element
 * @return {{dom: (*|Text), childInstances: unknown[], element}|{}}
 */
const instantiate = (element) => {
    const { type, props } = element
    const isDomElement = typeof type === 'string'
    if (isDomElement) {
        const dom = type !== TEXT_ELEMENT_TYPE
            ? document.createElement(type)
            : document.createTextNode(props.nodeValue)

        updateDomProperties(dom, [], props)

        const childProps = props.children || []
        const childInstances = childProps.map(instantiate)
        const childDom = childInstances.map(el => el.dom)
        childDom.forEach(el => dom.appendChild(el))

        return { dom, element, childInstances }
    } else {
        const instance = {}
        const publicInstance = createPublicInstance(element, instance)

        const innerElement = publicInstance.render()
        const resolveElement = instantiate(innerElement)
        const dom = resolveElement.dom

        Object.assign(instance, { dom, element, resolveElement, publicInstance });
        return instance
    }
}

/**
 * Функция для обновления dom-свойств
 * @param {HTMLElement} dom
 * @param {{}} prevProps
 * @param {{}} nextProps
 */

const updateDomProperties = (dom, prevProps, nextProps) => {
    const isListener = (value) => value.startsWith('on')
    const isAttribute = (value) => !isListener(value) && value !== 'children'

    Object.keys(prevProps).filter(isListener).forEach(
        el => dom.removeEventListener(el.substring(2).toLowerCase(), prevProps[el])
    )

    Object.keys(prevProps).filter(isAttribute).forEach(
        el => dom[el] = null
    )

    Object.keys(nextProps).filter(isListener).forEach(
        el => {
            dom.addEventListener(el.substring(2).toLowerCase(), nextProps[el])
        }
    )

    Object.keys(nextProps).filter(isAttribute).forEach(el => {
        dom[el] = nextProps[el]
    })
}

/**
 * Функция обновления внутреннего поддерерва
 * @param {Instance} internalInstance
 */
const updateInstance = (internalInstance) => {
    const parentDom = internalInstance.dom.parentNode
    const instanceElement = internalInstance.element
    reconcile(parentDom, internalInstance, instanceElement)
}

class Component {
    constructor(props) {
        this.props = props
        this.state = this.state || {}
    }

    setState(partialState) {
        this.state = {
            ...this.state,
            ...partialState,
        }
        updateInstance(this.__internalInstance)
    }
}

class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState(
            {
                count: this.state.count + 1
            }
        )
    }

    render() {
        return createElement('button',
            {
                ...this.props,
                textContent: `${this.state.count} ${this.props.textContent || 'click'}`,
                onClick: this.handleClick,
            })
    }
}

// Компоненты с разным типом

const li = createElement('li', { textContent: 'li' })
const items = new Array(4).fill(li)
const list = createElement('ul', null, ...items)

const textNode = createTextElement('text')

const compositeElement = createElement('div', {},
    createElement('span', {},
        createElement('span', { textContent: 'text4' })
    ))

const resolveElement = createElement(Example)

// render(textNode)
// render(list)
// render(compositeElement)
render(resolveElement)
