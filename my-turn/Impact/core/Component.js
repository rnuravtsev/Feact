import { updateInstance } from "./updateInstance.js";

/**
 * Базовый класс
 * Для расширения наших компонентов
 */
class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {}
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState)
    updateInstance(this.__internalInstance);
  }
}

export default Component
