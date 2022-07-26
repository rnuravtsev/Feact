import FeactReconciler, {instantiateFeactComponent} from "../FeactReconciler/FeactReconciler.js";

/**
 * ReactCompositeComponentWrapper
 * Тюнер наших компонент
 * добавляет все методы жизненного цикла и не только
 */

export default class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
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

    receiveComponent(nextElement) {
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }

    updateComponent(prevElement, nextElement) {
        const nextProps = nextElement.props;
        const inst = this._instance;
        if (inst.componentWillReceiveProps) {
            inst.componentWillReceiveProps(nextProps);
        }
        let shouldUpdate = true;
        if (inst.shouldComponentUpdate) {
            shouldUpdate = inst.shouldComponentUpdate(nextProps);
        }

        if (shouldUpdate) {
            this._performComponentUpdate(nextElement, nextProps);
        } else {
            // if skipping the update,
            // still need to set the latest props
            inst.props = nextProps;
        }
    }

    _performComponentUpdate(nextElement, nextProps) {
        this._currentElement = nextElement;
        const inst = this._instance;
        inst.props = nextProps;
        this._updateRenderedComponent();
    }

    _updateRenderedComponent() {
        const prevComponentInstance = this._renderedComponent;
        const inst = this._instance;
        const nextRenderedElement = inst.render();
        FeactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
    }
}
