import { createElement } from "../core/createElement.js";
import Component from "../core/Component.js";

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        const { count } = this.state

        this.setState({
            count: count + 1
        })
    }

    render() {
        const { title, count: propsCount } = this.props
        const { count: stateCount } = this.state || {}

        return (
            createElement('li', null,
                createElement('button', {
                    textContent: `${title} — ${stateCount || propsCount}`,
                    onClick: this.handleClick
                }))
        )
    }
}


export default Item
