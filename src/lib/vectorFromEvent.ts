import { VECTOR } from "./type";

function vectorFromEvent(
    event: MouseEvent,
    prevPoint: { clientX: number; clientY: number } | null
) {
    return {
        x: (prevPoint?.clientX != null
            ? Math.sign(prevPoint?.clientX - event.clientX)
            : 0) as VECTOR,
        y: (prevPoint?.clientY != null
            ? Math.sign(prevPoint?.clientY - event.clientY)
            : 0) as VECTOR,
    };
}

export default vectorFromEvent;
