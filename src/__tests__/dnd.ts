import { Dnd, DND_EVENT } from "../lib";

const onSpy = jest.fn((data) => {
    console.log(data);
});

it("dnd test", () => {
    const dragElement = document.createElement("div");
    const dropElement = document.createElement("div");
    dragElement.setAttribute("id", "dragElement");
    dropElement.setAttribute("id", "dropElement");

    const dnd = new Dnd();
    const dragListener = dnd.draggable(dragElement, false, {
        item: { id: "testDrag" },
    });
    const dropListener = dnd.droppable(dropElement);

    expect(onSpy).toBeCalledTimes(1);
});
