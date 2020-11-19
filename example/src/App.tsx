import React from "react";
import Test from "./component/Test";
import Test2 from "./component/Test2";
import Test3 from "./component/Test3";
import Test4 from "./component/Test4";

function App() {
    return (
        <div className="App" style={{ height: "100vh", width: "100vw" }}>
            <Test />
            <Test2 />
            <Test4 />
            <Test3 />
        </div>
    );
}

export default App;
