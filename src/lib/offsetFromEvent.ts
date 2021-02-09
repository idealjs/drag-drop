function offsetFromEvent(
    event: MouseEvent,
    source: { clientX: number; clientY: number } | null
) {
    return {
        x: event.clientX - (source?.clientX != null ? source?.clientX : 0),
        y: event.clientY - (source?.clientY != null ? source?.clientY : 0),
    };
}

export default offsetFromEvent;
