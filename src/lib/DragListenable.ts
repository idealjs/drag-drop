import EventEmitter from "events";
import html2canvas from "html2canvas";

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
    P extends HTMLElement,
    I extends IDragItem
> extends EventEmitter {
    private dnd: Dnd;
    private dragStartEmitted = false;
    private ele: T;
    private previewEle: P | null = null;
    private previewCanvas: HTMLCanvasElement | null = null;
    private item: I | null = null;
    private source: {
        clientX: number;
        clientY: number;
    } | null = null;
    private prevPoint: {
        clientX: number;
        clientY: number;
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
        if (ele instanceof HTMLElement) {
            ele.style.userSelect = "none";
        }
    }

    private onMouseDown(event: MouseEvent) {
        this.dragStartEmitted = false;
        this.dnd.setDragging(false);
        this.dnd.setDraggingEle(this.ele);
        this.dnd.setDraggingItem(this.item);
        this.source = {
            clientX: event.clientX,
            clientY: event.clientY,
        };
        this.prevPoint = {
            clientX: event.clientX,
            clientY: event.clientY,
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
        this.dnd.setPreviewCanvas(null);
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
            if (this.previewEle != null) {
                html2canvas(this.previewEle).then((canvas) => {
                    canvas.style.position = "absolute";
                    this.previewCanvas = canvas;
                    this.dnd.setPreviewCanvas(canvas);
                });
            }
        }
        if (this.previewCanvas != null) {
            this.previewCanvas.style.top = `${event.clientY}px`;
            this.previewCanvas.style.left = `${event.clientX}px`;
        }
        this.vector = this.vectorFromEvent(event);
        this.prevPoint = {
            clientX: event.clientX,
            clientY: event.clientY,
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
                event.clientX -
                (this.source?.clientX != null ? this.source?.clientX : 0),
            y:
                event.clientY -
                (this.source?.clientY != null ? this.source?.clientY : 0),
        };
    }

    private vectorFromEvent(event: MouseEvent) {
        return {
            x: (this.prevPoint?.clientX != null
                ? Math.sign(this.prevPoint?.clientX - event.clientX)
                : 0) as VECTOR,
            y: (this.prevPoint?.clientY != null
                ? Math.sign(this.prevPoint?.clientY - event.clientY)
                : 0) as VECTOR,
        };
    }

    public setPreviewEle(ele: P) {
        this.previewEle = ele;
    }
}

export default DragListenable;
