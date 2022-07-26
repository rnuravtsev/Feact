import FeactDOMComponent from "../FeactDOMComponent/FeactDOMComponent.js";
import FeactCompositeComponentWrapper
    from "../FeactCompositeComponentWrapper/FeactCompositeComponentWrapper.js";

export function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}

const FeactReconciler = {
    mountComponent(internalInstance, container) {
        return internalInstance.mountComponent(container);
    },

    receiveComponent(internalInstance, nextElement) {
        internalInstance.receiveComponent(nextElement);
    },

    performUpdateIfNecessary(internalInstance) {
        internalInstance.performUpdateIfNecessary();
    }
};

export default FeactReconciler
