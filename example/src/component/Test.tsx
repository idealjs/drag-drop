import { useEffect, useRef, useState } from "react";

import { DND_EVENT, useDnd } from "@idealjs/drag-drop";

const Test = () => {
    const dnd = useDnd();
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        const listener = dnd
            .draggable(ref.current!, true, {
                item: { id: "Test" },
            })
            .addListener(DND_EVENT.DRAG_START, (data) => {
                console.debug("[debug] drag start", data);
            })
            .addListener(DND_EVENT.DRAG_END, (data) => {
                console.debug("[debug] drag end", data);
            })
            .addListener(DND_EVENT.DRAG, (data) => {
                console.debug("[debug] drag move", data);
            });
        listener.setPreviewEle(ref.current!);
        return () => {};
    }, [dnd]);

    useEffect(() => {
        const handler = setInterval(() => {
            setCounter((s) => s + 1);
        }, 1000);
        return () => {
            clearInterval(handler);
        };
    }, []);

    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            style={{
                height: "100px",
                width: "100px",
                backgroundColor: "white",
                userSelect: "none",
            }}
        >
            {counter}
        </div>
    );
};

export default Test;
