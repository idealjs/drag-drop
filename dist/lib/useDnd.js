import { createContext, useContext } from "react";
import Dnd from "./dnd";
export const DndContext = createContext(new Dnd());
const useDnd = () => {
    return useContext(DndContext);
};
export default useDnd;
