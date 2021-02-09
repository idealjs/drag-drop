function isHTMLElement(el: Element): el is HTMLElement {
    return el instanceof HTMLElement;
}

export default isHTMLElement;
