import EventEmitter from "events";

import Dnd from "./Dnd";

type VECTOR = 1 | -1 | 0;

export interface IDragItem {
    id: string;
}

export enum DRAG_LISTENABLE_EVENT {
    DRAG = "DRAG_LISTENER/DRAG",
    DRAG_END = "DRAG_LISTENER/DRAG_END",
    DRAG_START = "DRAG_LISTENER/DRAG_START",
}

class DragListenable<
    T extends Element,
    I extends IDragItem
> extends EventEmitter {
    private dnd: Dnd;
    private dragStartEmitted = false;
    private ele: T;
    private item: I | null = null;
    private source: {
        screenX: number;
        screenY: number;
    } | null = null;
    private prevPoint: {
        screenX: number;
        screenY: number;
    } | null = null;
    private offset: {
        x: number;
        y: number;
    } | null = null;
    private vector: {
        x: VECTOR;
        y: VECTOR;
    } | null = null;

    constructor(dnd: Dnd, ele: T, item?: I) {
        super();
        this.dnd = dnd;
        this.ele = ele;
        this.item = item != null ? item : null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        ele.addEventListener("mousedown", this.onMouseDown as EventListener);
    }

    private onMouseDown(event: MouseEvent) {
        this.dragStartEmitted = false;
        this.dnd.setDragging(false);
        this.dnd.setDraggingEle(this.ele);
        this.dnd.setDraggingItem(this.item);
        this.source = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.prevPoint = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.offset = {
            x: 0,
            y: 0,
        };
        this.vector = {
            x: 0,
            y: 0,
        };
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
    }

    private onMouseUp(event: MouseEvent) {
        this.emit(DRAG_LISTENABLE_EVENT.DRAG_END, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });

        this.dragStartEmitted = false;
        this.dnd.setDragging(false);
        this.dnd.setDraggingEle(null);
        this.dnd.setDraggingItem(null);
        this.source = null;
        this.offset = null;
        this.vector = null;
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dragStartEmitted === false) {
            this.emit(DRAG_LISTENABLE_EVENT.DRAG_START, {
                source: this.source,
                offset: this.offset,
                vector: this.vector,
            });
            this.dnd.setDragging(true);
            this.dragStartEmitted = true;
        }
        this.vector = this.vectorFromEvent(event);

        this.prevPoint = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.offset = this.offsetFromEvent(event);
        this.emit(DRAG_LISTENABLE_EVENT.DRAG, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });
    }

    private offsetFromEvent(event: MouseEvent) {
        return {
            x:
                event.screenX -
                (this.source?.screenX != null ? this.source?.screenX : 0),
            y:
                event.screenY -
                (this.source?.screenY != null ? this.source?.screenY : 0),
        };
    }

    private vectorFromEvent(event: MouseEvent) {
        return {
            x: (this.prevPoint?.screenX != null
                ? Math.sign(this.prevPoint?.screenX - event.screenX)
                : 0) as VECTOR,
            y: (this.prevPoint?.screenY != null
                ? Math.sign(this.prevPoint?.screenY - event.screenY)
                : 0) as VECTOR,
        };
    }
}

export default DragListenable;
