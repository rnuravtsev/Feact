import FeactCompositeComponentWrapper from "../FeactCompositeComponentWrapper/FeactCompositeComponentWrapper.js";
import FeactReconciler from "../FeactReconciler/FeactReconciler.js";

const TopLevelWrapper = function (props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function () {
    return this.props;
};

const Feact = {
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }
        Constructor.prototype =
            Object.assign(Constructor.prototype, spec);
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
        const wrapperElement =
            this.createElement(TopLevelWrapper, element);
        const componentInstance =
            new FeactCompositeComponentWrapper(wrapperElement);
        return FeactReconciler.mountComponent(
            componentInstance,
            container
        );
    }
}

export default Feact
