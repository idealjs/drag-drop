import EventEmitter from "events";

import Dnd from "./Dnd";

export enum DROP_LISTENABLE_EVENT {
    DRAG_ENTER = "DROP_LISTENER/DRAG_ENTER",
    DRAG_LEAVE = "DROP_LISTENER/DRAG_LEAVE",
    DRAG_OVER = "DROP_LISTENER/DRAG_OVER",
    DROP = "DROP_LISTENER/DROP",
}

class DropListenable<T extends Element> extends EventEmitter {
    private dnd: Dnd;
    private clientPosition: {
        x: number;
        y: number;
    } | null = null;
    constructor(ele: T, dnd: Dnd) {
        super();
        this.dnd = dnd;
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        ele.addEventListener("mouseup", this.onMouseUp as EventListener);
        ele.addEventListener("mousemove", this.onMouseMove as EventListener);
        ele.addEventListener("mouseleave", this.onMouseLeave as EventListener);
    }

    private onMouseUp(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };
            this.emit(DROP_LISTENABLE_EVENT.DROP, {
                clientPosition: this.clientPosition,
            });
            this.clientPosition = null;
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };

            this.emit(DROP_LISTENABLE_EVENT.DRAG_OVER, {
                clientPosition: this.clientPosition,
                item: this.dnd.getDraggingItem(),
                ele: this.dnd.getDraggingEle(),
            });
        }
    }

    private onMouseLeave(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };

            this.emit(DROP_LISTENABLE_EVENT.DRAG_LEAVE, {
                clientPosition: this.clientPosition,
                item: this.dnd.getDraggingItem(),
                ele: this.dnd.getDraggingEle(),
            });
        }
    }
}

export default DropListenable;
