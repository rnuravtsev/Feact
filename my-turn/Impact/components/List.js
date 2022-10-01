import { createElement } from "../core/createElement.js";
import Component from "../core/Component.js";
import Item from "./Item.js";

class List extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items } = this.props

    return (
        createElement('ul', null,
            items.map(({ title, count }) => createElement(Item, { title, count }))
        ))
  }
}

export default List
