import EventEmitter from "events";
import html2canvas from "html2canvas";

import Dnd from "./Dnd";
import isHTMLElement from "./isHTMLElement";
import offsetFromEvent from "./offsetFromEvent";
import { VECTOR } from "./type";
import vectorFromEvent from "./vectorFromEvent";

export interface IDragItem {
    id: string;
}

export enum DRAG_LISTENABLE_EVENT {
    DRAG = "DRAG_LISTENER/DRAG",
    DRAG_END = "DRAG_LISTENER/DRAG_END",
    DRAG_START = "DRAG_LISTENER/DRAG_START",
}

class DragListenable<
    E extends Element,
    I extends IDragItem
> extends EventEmitter {
    private dnd: Dnd;
    private dragStartEmitted = false;
    private el: E;
    private previewEle: HTMLElement | null = null;
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

    constructor(dnd: Dnd, el: E, crossWindow: boolean, options?: { item?: I }) {
        super();
        this.dnd = dnd;
        this.el = el;
        this.item = options?.item != null ? options.item : null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        if (crossWindow) {
            if (isHTMLElement(this.el)) {
                this.el.addEventListener("dragstart", this.onDragStart);
                this.el.draggable = true;
            } else {
                throw new Error(`Can't add drag to ${this.el}`);
            }
        } else {
            this.el.addEventListener(
                "mousedown",
                this.onMouseDown as EventListener
            );
        }

        if (el instanceof HTMLElement) {
            el.style.userSelect = "none";
        }
    }

    private onMouseDown(event: MouseEvent) {
        this.dragStartEmitted = false;
        this.dnd.setDragging(false);
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

        this.clean();

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
                    canvas.style.pointerEvents = "none";
                    this.previewCanvas = canvas;
                    this.dnd.setPreviewCanvas(canvas);
                });
            }
        }
        if (this.previewCanvas != null) {
            this.previewCanvas.style.top = `${event.clientY}px`;
            this.previewCanvas.style.left = `${event.clientX}px`;
        }
        this.vector = vectorFromEvent(event, this.prevPoint);
        this.prevPoint = {
            clientX: event.clientX,
            clientY: event.clientY,
        };
        this.offset = offsetFromEvent(event, this.source);
        this.emit(DRAG_LISTENABLE_EVENT.DRAG, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });
    }

    private async onDragStart(event: DragEvent) {
        this.dragStartEmitted = false;
        this.dnd.setDragging(false);
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
        if (this.previewEle) {
            try {
                event.dataTransfer?.setDragImage(
                    this.previewEle,
                    event.offsetX,
                    event.offsetY
                );
            } catch (error) {
                console.error(error);
            }
        } else {
            event.dataTransfer?.setDragImage(
                document.createElement("div"),
                event.offsetX,
                event.offsetY
            );
        }
        this.emit(DRAG_LISTENABLE_EVENT.DRAG_START, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });

        if (isHTMLElement(this.el)) {
            this.el.addEventListener("drag", this.onDrag);
            this.el.addEventListener("dragend", this.onDragEnd);
        } else {
            throw new Error(`Can't add drag to ${this.el}`);
        }
    }

    private onDrag(event: DragEvent) {
        this.vector = vectorFromEvent(event, this.prevPoint);
        this.prevPoint = {
            clientX: event.clientX,
            clientY: event.clientY,
        };
        this.offset = offsetFromEvent(event, this.source);
        this.emit(DRAG_LISTENABLE_EVENT.DRAG, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });
    }

    private onDragEnd() {
        this.emit(DRAG_LISTENABLE_EVENT.DRAG_END, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });

        this.clean();

        if (isHTMLElement(this.el)) {
            this.el.removeEventListener("drag", this.onDrag);
            this.el.removeEventListener("dragend", this.onDragEnd);
        } else {
            throw new Error(`Can't add drag to ${this.el}`);
        }
    }

    public setPreviewEle(el: HTMLElement) {
        this.previewEle = el;
    }

    private clean() {
        this.dnd.setDragging(false);
        this.dnd.setDraggingItem(null);
        this.dnd.setPreviewCanvas(null);
        this.source = null;
        this.offset = null;
        this.vector = null;
    }
}

export default DragListenable;
