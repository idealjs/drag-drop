import { useContext } from "react";
import { createContext } from "react";
import Portal from "./Portal";
import Test from "./Test";
import Test2 from "./Test2";
import Test3 from "./Test3";
import Test4 from "./Test4";

export const test5Context = createContext<string[]>([]);

const Test5 = () => {
    const data = useContext(test5Context);
    return (
        <div>
            {data.map((d) => {
                return (
                    <Portal key={d}>
                        {d}
                        <Test />
                        <Test2 />
                        <Test3 />
                        <Test4 />
                    </Portal>
                );
            })}
        </div>
    );
};

export default Test5;
