export function createEl<T extends keyof HTMLElementTagNameMap>(tag: T, className?: string, text?: string) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    
    if (text !== undefined) {
        el.textContent = text;
    }

    return el;
}

export function createBtn(text: string, onClick?: () => void, className?: string) {
    const btn = createEl("button") as HTMLButtonElement;
    btn.textContent = text;
    if (className) btn.className = className;
    if (onClick) btn.onclick = onClick;
    return btn;
}

export function createSection(titleText: string, sections: HTMLDivElement[], container: HTMLDivElement) {
    const section = createEl("div", "ui-section");
    sections.push(section);

    const title = createEl("div", "ui-section-title", titleText);
    section.appendChild(title);

    container.appendChild(section);
    return section;
}

export function createListItem(text: string) {
    const item = createEl("div", "ui-list-item");
    item.append(text + " ");
    return item;
}

export function wrapBtns(...btns: HTMLElement[]) {
    const wrap = createEl("div", "btns-wrap");
    btns.forEach(b => wrap.appendChild(b));
    return wrap;
}

export function createContainer(wrap: HTMLDivElement, container: HTMLDivElement) {
    wrap.appendChild(container);
    document.body.appendChild(wrap);
}