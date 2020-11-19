/// <reference types="node" />
import { EventEmitter } from "events";
interface IDragItem {
    id: string;
}
declare class DragListenable<T extends Element, I extends IDragItem> extends EventEmitter {
    private dnd;
    private dragStartEmitted;
    private ele;
    private item;
    private source;
    private prevSource;
    private offset;
    private vector;
    constructor(dnd: Dnd, ele: T, item?: I);
    onMouseDown(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
}
declare class DropListenable<T extends Element> extends EventEmitter {
    private dnd;
    private ele;
    private clientPosition;
    constructor(ele: T, dnd: Dnd);
    onMouseDown(): void;
    onMouseUp(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseLeave(event: MouseEvent): void;
}
export declare enum DND_EVENT {
    DROP = "DND_EVENT/DROP",
    DROP_MOVE = "DND_EVENT/DROP_MOVE",
    DRAG_LEAVE = "DND_EVENT/DRAG_LEAVE",
    DRAG_MOVE = "DND_EVENT/DRAG_MOVE",
    DRAG_START = "DND_EVENT/DRAG_START",
    DRAG_END = "DND_EVENT/DRAG_END"
}
declare class Dnd extends EventEmitter {
    constructor();
    private dragging;
    private draggingEle;
    private draggingItem;
    draggable<T extends Element, I extends IDragItem>(ele: T, item?: I): DragListenable<T, I>;
    droppable<T extends Element>(ele: T): DropListenable<T>;
    setDragging(dragging: boolean): void;
    setDraggingEle<T extends Element>(ele: T | null): void;
    setDraggingItem<I extends IDragItem>(item: I | null): void;
    isDragging(): boolean;
}
export default Dnd;
