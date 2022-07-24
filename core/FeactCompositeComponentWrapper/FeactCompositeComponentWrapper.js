import FeactReconciler, { instantiateFeactComponent } from "../FeactReconciler/FeactReconciler.js";

/**
 * ReactCompositeComponentWrapper
 * Тюнер наших компонент
 * добавляет компоненту все методы жизненного цикла
 */

export default class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance =
            new Component(this._currentElement.props);
        this._instance = componentInstance;
        if (componentInstance.componentWillMount) {
            componentInstance.componentWillMount();
        }
        const markUp = this.performInitialMount(container);
        if (componentInstance.componentDidMount) {
            componentInstance.componentDidMount();
        }
        return markUp;
    }

    performInitialMount(container) {
        const renderedElement = this._instance.render();
        const child = instantiateFeactComponent(renderedElement);
        this._renderedComponent = child;
        return FeactReconciler.mountComponent(child, container);
    }
}
