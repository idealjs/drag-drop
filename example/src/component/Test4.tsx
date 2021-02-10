import { useEffect, useRef } from "react";

import { DND_EVENT, useDnd } from "@idealjs/drag-drop";

const Test4 = () => {
    const dnd = useDnd();

    useEffect(() => {
        dnd.draggable(ref.current!, true, {
            item: {
                id: "Test",
            },
        })
            .addListener(DND_EVENT.DRAG_START, (data) => {
                console.debug("[debug] drag start", data);
            })
            .addListener(DND_EVENT.DRAG_END, (data) => {
                console.debug("[debug] drag end", data);
            })
            .addListener(DND_EVENT.DRAG, (data) => {
                console.debug("[debug] drag move", data);
            })
            .setPreviewEle(ref.current!);
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

export default Test4;
