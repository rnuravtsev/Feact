import Feact from "./Feact/Feact.js";
import Title from "../components/Title/Title.js";

Feact.render(
    Feact.createElement(Title, {message: 'hey there Feact'}),
    document.getElementById('root')
);
