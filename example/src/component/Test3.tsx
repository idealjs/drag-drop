import { useEffect, useRef } from "react";

import { DND_EVENT, useDnd } from "@idealjs/drag-drop";

const Test3 = () => {
    const dnd = useDnd();

    useEffect(() => {
        dnd.droppable(ref.current!)
            .addListener(DND_EVENT.DROP, (data) => {
                console.debug("[debug] drop", data);
            })
            .addListener(DND_EVENT.DRAG_OVER, (data) => {
                console.debug("[debug] drag over", data);
            });

        return () => {};
    }, [dnd]);

    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            style={{
                height: "100px",
                width: "100px",
                backgroundColor: "blue",
            }}
        ></div>
    );
};

export default Test3;
