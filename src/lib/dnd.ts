import { EventEmitter } from "events";

enum DRAG_LISTENABLE_EVENT {
    DRAG_END = "DRAG_END",
    DRAG_START = "DRAG_START",
    MOVE = "MOVE",
}

interface IDragItem {
    id: string;
}

type VECTOR = 1 | -1 | 0;

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
    private prevSource: {
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

    onMouseDown(event: MouseEvent) {
        this.dragStartEmitted = false;
        this.dnd.setDragging(true);
        this.dnd.setDraggingEle(this.ele);
        this.dnd.setDraggingItem(this.item);
        this.source = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.prevSource = {
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

    onMouseUp(event: MouseEvent) {
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

    onMouseMove(event: MouseEvent) {
        if (this.dragStartEmitted === false) {
            this.emit(DRAG_LISTENABLE_EVENT.DRAG_START, {
                source: this.source,
                offset: this.offset,
                vector: this.vector,
            });
        }
        this.vector = {
            x: (this.prevSource?.screenX != null
                ? Math.sign(this.prevSource?.screenX - event.screenX)
                : 0) as VECTOR,
            y: (this.prevSource?.screenY != null
                ? Math.sign(this.prevSource?.screenY - event.screenY)
                : 0) as VECTOR,
        };

        this.prevSource = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.offset = {
            x:
                event.screenX -
                (this.source?.screenX != null ? this.source?.screenX : 0),
            y:
                event.screenY -
                (this.source?.screenY != null ? this.source?.screenY : 0),
        };
        this.emit(DRAG_LISTENABLE_EVENT.MOVE, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });
    }
}

enum DROP_LISTENABLE_EVENT {
    DROP = "DROP",
    MOVE = "MOVE",
}

class DropListenable<T extends Element> extends EventEmitter {
    private dnd: Dnd;
    private ele: T;
    constructor(ele: T, dnd: Dnd) {
        super();
        this.dnd = dnd;
        this.ele = ele;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        ele.addEventListener("mouseup", this.onMouseUp);
        ele.addEventListener("mousemove", this.onMouseMove);
    }

    onMouseDown() {}

    onMouseUp(event: Event) {
        if (this.dnd.isDragging()) {
            this.emit(DROP_LISTENABLE_EVENT.DROP);
        }
    }

    onMouseMove() {
        if (this.dnd.isDragging()) {
            this.emit(DROP_LISTENABLE_EVENT.MOVE);
        }
    }
}

export enum DND_EVENT {
    DROP = "DND_EVENT/DROP",
    DROP_MOVE = "DND_EVENT/DROP_MOVE",
    DRAG_MOVE = "DND_EVENT/DRAG_MOVE",
    DRAG_START = "DND_EVENT/DRAG_START",
    DRAG_END = "DND_EVENT/DRAG_END",
}

class Dnd extends EventEmitter {
    constructor() {
        super();
        this.setDragging = this.setDragging.bind(this);
        this.setDraggingEle = this.setDraggingEle.bind(this);
    }

    private dragging = false;
    private draggingEle: Element | null = null;
    private draggingItem: IDragItem | null = null;

    draggable<T extends Element, I extends IDragItem>(ele: T, item?: I) {
        const listenable = new DragListenable(this, ele, item);

        listenable.on(DRAG_LISTENABLE_EVENT.DRAG_START, (data) => {
            listenable.emit(DND_EVENT.DRAG_START, data);
        });

        listenable.on(DRAG_LISTENABLE_EVENT.DRAG_END, (data) => {
            listenable.emit(DND_EVENT.DRAG_END, data);
        });

        listenable.on(DRAG_LISTENABLE_EVENT.MOVE, (data) => {
            listenable.emit(DND_EVENT.DRAG_MOVE, data);
        });

        return listenable;
    }

    droppable<T extends Element>(ele: T) {
        const listenable = new DropListenable(ele, this);
        listenable.on(DROP_LISTENABLE_EVENT.DROP, () => {
            listenable.emit(DND_EVENT.DROP, {
                item: this.draggingItem,
                ele: this.draggingEle,
            });
        });

        listenable.on(DROP_LISTENABLE_EVENT.MOVE, () => {
            listenable.emit(DND_EVENT.DROP_MOVE, {
                item: this.draggingItem,
                ele: this.draggingEle,
            });
        });

        return listenable;
    }

    setDragging(dragging: boolean) {
        this.dragging = dragging;
    }

    setDraggingEle<T extends Element>(ele: T | null) {
        this.draggingEle = ele;
    }

    setDraggingItem<I extends IDragItem>(item: I | null) {
        this.draggingItem = item;
    }

    isDragging() {
        return this.dragging;
    }
}

export default Dnd;
