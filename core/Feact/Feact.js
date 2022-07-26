import FeactCompositeComponentWrapper from "../FeactCompositeComponentWrapper/FeactCompositeComponentWrapper.js";
import FeactReconciler from "../FeactReconciler/FeactReconciler.js";

function renderNewRootComponent(element, container) {
    const wrapperElement =
        Feact.createElement(TopLevelWrapper, element);
    const componentInstance =
        new FeactCompositeComponentWrapper(wrapperElement);
    const markUp = FeactReconciler.mountComponent(
        componentInstance,
        container
    );
    // new line here, store the component instance on the container
    // we want its _renderedComponent because componentInstance is just
    // the TopLevelWrapper, which we don't need for updates
    container.__feactComponentInstance =
        componentInstance._renderedComponent;
}

function getTopLevelComponentInContainer(container) {
    return container.__feactComponentInstance;
}

function updateRootComponent(prevComponent, nextElement) {
    prevComponent.receiveComponent(nextElement)
}


const TopLevelWrapper = function (props) {
    this.props = props;
};

function FeactComponent() {
}

function mixSpecIntoComponent(Constructor, spec) {
    const proto = Constructor.prototype;
    for (const key in spec) {
        proto[key] = spec[key];
    }
}

FeactComponent.prototype.setState = function(partialState) {
    const internalInstance = FeactInstanceMap.get(this);
    internalInstance._pendingPartialState = internalInstance._pendingPartialState || [];
    internalInstance.push(partialState);
    if (!internalInstance._rendering) {
        FeactReconciler.performUpdateIfNecessary(internalInstance);
    }

};

TopLevelWrapper.prototype.render = function () {
    return this.props;
};

export const FeactInstanceMap = {
    set(key, value) {
        key.__feactInternalInstance = value;
    },
    get(key) {
        return key.__feactInternalInstance;
    }
};

const Feact = {
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }

        const initialState = this.getInitialState ? this.getInitialState() : null;
        this.state = initialState;

        Constructor.prototype = new FeactComponent();

        mixSpecIntoComponent(Constructor, spec);
        return Constructor;
    },

    createElement(type, props, children) {
        const element = {
            type,
            props: props || {}
        };

        if (children) {
            element.props.children = children;
        }

        return element;
    },

    render(element, container) {
        const prevComponent =
            getTopLevelComponentInContainer(container);
        if (prevComponent) {
            return updateRootComponent(
                prevComponent,
                element
            );
        } else {
            return renderNewRootComponent(element, container);
        }
    }}

export default Feact
