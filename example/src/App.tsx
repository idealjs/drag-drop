import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import Test from "./component/Test";
import Test2 from "./component/Test2";
import Test3 from "./component/Test3";
import Test4 from "./component/Test4";
import Test5, { test5Context } from "./component/Test5";

function App() {
    const [portalState, setPortalState] = useState<string[]>([]);
    const onClick = useCallback(() => {
        setPortalState((s) => s.concat("b"));
    }, []);
    return (
        <test5Context.Provider value={portalState}>
            <div className="App" style={{ height: "100vh", width: "100vw" }}>
                <button onClick={onClick}>open portal</button>
                <Test />
                <Test2 />
                <Test3 />
                <Test4 />
                <Test5 />
            </div>
        </test5Context.Provider>
    );
}

export default App;
