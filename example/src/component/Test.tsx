import React, { useEffect, useRef } from "react";

import { DND_EVENT, useDnd } from "@idealjs/drag-drop";

const Test = () => {
    const dnd = useDnd();

    useEffect(() => {
        dnd.draggable(ref.current!, {
            id: "Test",
        })
            .addListener(DND_EVENT.DRAG_START, (data) => {
                console.log("test test drag start", data);
            })
            .addListener(DND_EVENT.DRAG_END, (data) => {
                console.log("test test drag end", data);
            })
            .addListener(DND_EVENT.DRAG, (data) => {
                console.log("test test drag move", data);
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
                backgroundColor: "black",
            }}
        ></div>
    );
};

export default Test;
