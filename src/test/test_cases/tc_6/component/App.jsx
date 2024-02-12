import React from "react";
import anotherApp from "./anotherApp"; // this is purposefully the wrong file path for anotherApp

const App = () => {
    return (
        <div>
            <p>Hello from App.jsx</p>
            <anotherApp />
        </div>
    )
};

export default App;