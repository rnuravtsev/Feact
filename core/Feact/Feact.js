import FeactCompositeComponentWrapper from "../FeactCompositeComponentWrapper/FeactCompositeComponentWrapper.js";

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

        Constructor.prototype.render = spec.render;

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
        const wrapperElement =  this.createElement(TopLevelWrapper, element);
        const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
        return componentInstance.mountComponent(container);
    }
}

export default Feact
