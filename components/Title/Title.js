import Feact from "../../core/Feact/Feact.js";

const Title = Feact.createClass({
    render() {
        return Feact.createElement('h1', null, this.props.message);
    }
});

export default Title
