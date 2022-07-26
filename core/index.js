import Message from "../components/Message/Message.js";
import Feact from "./Feact/Feact.js";
import Title from "../components/Title/Title.js";

Feact.render(
    Feact.createElement(Title, { message: 'hello' }),
    document.getElementById('root')
);

setTimeout(function() {
    Feact.render(
        Feact.createElement(Message, { message: 'hello again' }),
        document.getElementById('root')
    );
}, 2000);
