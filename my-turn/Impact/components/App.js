import { createElement } from "../core/createElement.js";
import { mockData } from "../data.js";
import Component from "../core/Component.js";
import List from "./List.js";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            createElement('div', { className: 'Turkey' },
                createElement('h1', { textContent: 'Impact' }, null),
                createElement(List, {
                        items: mockData
                    }
                )
            ))
    }
}

export default App
