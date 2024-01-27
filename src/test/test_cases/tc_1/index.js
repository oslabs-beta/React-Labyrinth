import React from "react";
import { render } from "react-dom";
import App from "./component/App";

//TEST 1 - Simple App with 2 components, App and Main
//App renders Main

render(
    <div>
        <App />
    </div>, document.getElementById('root')
);