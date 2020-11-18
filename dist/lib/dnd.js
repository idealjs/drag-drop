import { EventEmitter } from "events";
var DRAG_LISTENABLE_EVENT;
(function (DRAG_LISTENABLE_EVENT) {
    DRAG_LISTENABLE_EVENT["DRAG_END"] = "DRAG_END";
    DRAG_LISTENABLE_EVENT["DRAG_START"] = "DRAG_START";
    DRAG_LISTENABLE_EVENT["MOVE"] = "MOVE";
})(DRAG_LISTENABLE_EVENT || (DRAG_LISTENABLE_EVENT = {}));
class DragListenable extends EventEmitter {
    constructor(dnd, ele, item) {
        super();
        this.dragStartEmitted = false;
        this.item = null;
        this.source = null;
        this.prevSource = null;
        this.offset = null;
        this.vector = null;
        this.dnd = dnd;
        this.ele = ele;
        this.item = item != null ? item : null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        ele.addEventListener("mousedown", this.onMouseDown);
    }
    onMouseDown(event) {
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
    onMouseUp(event) {
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
    onMouseMove(event) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.dragStartEmitted === false) {
            this.emit(DRAG_LISTENABLE_EVENT.DRAG_START, {
                source: this.source,
                offset: this.offset,
                vector: this.vector,
            });
        }
        this.vector = {
            x: (((_a = this.prevSource) === null || _a === void 0 ? void 0 : _a.screenX) != null
                ? Math.sign(((_b = this.prevSource) === null || _b === void 0 ? void 0 : _b.screenX) - event.screenX)
                : 0),
            y: (((_c = this.prevSource) === null || _c === void 0 ? void 0 : _c.screenY) != null
                ? Math.sign(((_d = this.prevSource) === null || _d === void 0 ? void 0 : _d.screenY) - event.screenY)
                : 0),
        };
        this.prevSource = {
            screenX: event.screenX,
            screenY: event.screenY,
        };
        this.offset = {
            x: event.screenX -
                (((_e = this.source) === null || _e === void 0 ? void 0 : _e.screenX) != null ? (_f = this.source) === null || _f === void 0 ? void 0 : _f.screenX : 0),
            y: event.screenY -
                (((_g = this.source) === null || _g === void 0 ? void 0 : _g.screenY) != null ? (_h = this.source) === null || _h === void 0 ? void 0 : _h.screenY : 0),
        };
        this.emit(DRAG_LISTENABLE_EVENT.MOVE, {
            source: this.source,
            offset: this.offset,
            vector: this.vector,
        });
    }
}
var DROP_LISTENABLE_EVENT;
(function (DROP_LISTENABLE_EVENT) {
    DROP_LISTENABLE_EVENT["DROP"] = "DROP";
    DROP_LISTENABLE_EVENT["MOVE"] = "MOVE";
})(DROP_LISTENABLE_EVENT || (DROP_LISTENABLE_EVENT = {}));
class DropListenable extends EventEmitter {
    constructor(ele, dnd) {
        super();
        this.dnd = dnd;
        this.ele = ele;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        ele.addEventListener("mouseup", this.onMouseUp);
        ele.addEventListener("mousemove", this.onMouseMove);
    }
    onMouseDown() { }
    onMouseUp(event) {
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
export var DND_EVENT;
(function (DND_EVENT) {
    DND_EVENT["DROP"] = "DND_EVENT/DROP";
    DND_EVENT["DROP_MOVE"] = "DND_EVENT/DROP_MOVE";
    DND_EVENT["DRAG_MOVE"] = "DND_EVENT/DRAG_MOVE";
    DND_EVENT["DRAG_START"] = "DND_EVENT/DRAG_START";
    DND_EVENT["DRAG_END"] = "DND_EVENT/DRAG_END";
})(DND_EVENT || (DND_EVENT = {}));
class Dnd extends EventEmitter {
    constructor() {
        super();
        this.dragging = false;
        this.draggingEle = null;
        this.draggingItem = null;
        this.setDragging = this.setDragging.bind(this);
        this.setDraggingEle = this.setDraggingEle.bind(this);
    }
    draggable(ele, item) {
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
    droppable(ele) {
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
    setDragging(dragging) {
        this.dragging = dragging;
    }
    setDraggingEle(ele) {
        this.draggingEle = ele;
    }
    setDraggingItem(item) {
        this.draggingItem = item;
    }
    isDragging() {
        return this.dragging;
    }
}
export default Dnd;
