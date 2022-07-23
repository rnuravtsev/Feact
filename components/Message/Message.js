import Feact from "../../core/Feact/Feact.js";
import Title from "../Title/Title.js";


const Message = Feact.createClass({
    render() {
        if (this.props.asTitle) {
            return Feact.createElement(Title, {
                message: this.props.message
            });
        } else {
            return Feact.createElement('p', null, this.props.message);
        }
    }
})

export default Message
