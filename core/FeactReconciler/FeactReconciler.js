import FeactDOMComponent from "../FeactDOMComponent/FeactDOMComponent.js";
import FeactCompositeComponentWrapper
    from "../FeactCompositeComponentWrapper/FeactCompositeComponentWrapper.js";
import Transaction from '../Transaction/Transaction.js'

export function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}

const SELECTION_RESTORATION = {
    initialize() {
        const focusedElem = document.activeElement;
        return {
            focusedElem,
            selection: {
                start: focusedElem.selectionStart,
                end: focusedElem.selectionEnd
            }
        };
    },
    close(priorSelectionInformation) {
        const focusedElem = priorSelectionInformation.focusedElem;
        focusedElem.selectionStart =
            priorSelectionInformation.selection.start;
        focusedElem.selectionEnd =
            priorSelectionInformation.selection.end;
    }
};

const updateTransaction = new Transaction(SELECTION_RESTORATION);

const FeactReconciler = {
    mountComponent(internalInstance, container) {
        return internalInstance.mountComponent(container);
    },

    receiveComponent(internalInstance, nextElement) {
        updateTransaction.perform(function() {
            internalInstance.receiveComponent(nextElement);
        });
    },

    performUpdateIfNecessary(internalInstance) {
        internalInstance.performUpdateIfNecessary();
    }
};

export default FeactReconciler
