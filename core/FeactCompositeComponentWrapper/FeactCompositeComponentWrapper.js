import {FeactInstanceMap} from "../Feact/Feact.js";
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
        const componentInstance =
            new Component(this._currentElement.props);
        this._instance = componentInstance;
        FeactInstanceMap.set(componentInstance, this);

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

    performUpdateIfNecessary() {
        this.updateComponent(this._currentElement, this._currentElement);
    }

    receiveComponent(nextElement) {
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }

    updateComponent(prevElement, nextElement) {
        this._rendering = true;
        const nextProps = nextElement.props;
        const inst = this._instance;
        const willReceive = prevElement !== nextElement;

        if (willReceive && inst.componentWillReceiveProps) {
            inst.componentWillReceiveProps(nextProps);
        }

        let shouldUpdate = true;

        // const nextState = Object.assign({}, inst.state, this._pendingPartialState);
        const nextState = this._processPendingState();
        this._pendingPartialState = null;

        if (inst.shouldComponentUpdate) {
            shouldUpdate =
                inst.shouldComponentUpdate(nextProps, nextState);
        }

        if (shouldUpdate) {
            this._performComponentUpdate(
                nextElement, nextProps, nextState
            );
        } else {
            inst.props = nextProps;
            inst.state = nextState;
        }

        this._rendering = false;
    }

    _processPendingState() {
        const inst = this._instance;
        if (!this._pendingPartialState) {
            return inst.state;
        }
        let nextState = inst.state;
        for (let i = 0; i < this._pendingPartialState.length; ++i) {
            const partialState = this._pendingPartialState[i];
            if (typeof partialState === 'function') {
                nextState = partialState(nextState);
            } else {
                nextState = Object.assign(nextState, patialState);
            }
        }
        this._pendingPartialState = null;
        return nextState;
    }

    _performComponentUpdate(nextElement, nextProps, nextState) {
        this._currentElement = nextElement;
        const inst = this._instance;
        inst.props = nextProps;
        inst.state = nextState;
        this._updateRenderedComponent();
    }

    _updateRenderedComponent() {
        const prevComponentInstance = this._renderedComponent;
        const inst = this._instance;
        const nextRenderedElement = inst.render();
        FeactReconciler.receiveComponent(
            prevComponentInstance,
            nextRenderedElement
        );
    }
}
