import { Orbit } from "../entities/Orbit";
import { Comet } from "../entities/Comet";
import { Modal } from "./Modal";
import type { EventBus } from "../core/EventBus";

import './UI.css';

export class UIManager {
    private container: HTMLDivElement;
    private containerWrap: HTMLDivElement;
    private orbitSelect!: HTMLSelectElement;
    private orbitListContainer!: HTMLDivElement;
    private cometListContainer!: HTMLDivElement;
    private sections: HTMLDivElement[] = [];

    public orbitList: Orbit[] = [];
    public cometList: Comet[] = [];

    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement("div");
        this.container.className = 'ui-container';
        this.containerWrap = document.createElement("div");
        this.containerWrap.className = 'ui-container-wrap';
        this.containerWrap.appendChild(this.container);
        document.body.appendChild(this.containerWrap);

        this.createToggleButton();
        this.createOrbitUI();
        this.createCometUI();
    }

    private createToggleButton() {
        const btn = document.createElement('button');
        btn.className = 'ui-toggle-btn';
        btn.textContent = '☰';
        btn.onclick = () => {
            const orbitSettings = document.getElementById("orbit-settings-panel");
            const collapsed = this.container.classList.toggle('collapsed');
            this.sections.forEach(section => section.classList.toggle('collapsed', collapsed));
            btn.classList.toggle('collapsed', collapsed);

            if (collapsed) orbitSettings?.remove();
        };
        this.containerWrap.appendChild(btn);
    }

    private createOrbitUI() {
        const orbitContainer = document.createElement("div");
        orbitContainer.className = 'ui-section';
        this.sections.push(orbitContainer);

        const title = document.createElement("div");
        title.className = 'ui-section-title';
        title.textContent = "Orbits";
        orbitContainer.appendChild(title);

        this.orbitListContainer = document.createElement("div");
        this.orbitListContainer.className = 'ui-list';
        orbitContainer.appendChild(this.orbitListContainer);

        const input = document.createElement("input");
        input.className = 'ui-input';
        input.placeholder = "Orbit name";
        orbitContainer.appendChild(input);

        const addBtn = document.createElement("button");
        addBtn.className = 'ui-button';
        addBtn.textContent = "Add Orbit";
        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Orbit name required.`, "error");

            const exists = this.orbitList.find(o => o.name === name);
            if (exists) return Modal(`Orbit "${name}" already exists.`, "error");
            
            this.eventBus.emit("addOrbit", name, this.orbitList, (name: string, orbit: Orbit) => {
                const cometSelect = document.getElementById("comet-select");
                cometSelect?.classList.remove("empty");

                const addComet = document.getElementById("add-comet") as HTMLButtonElement | null;;
                if (addComet) addComet.disabled = false;
                
                this.addOrbitItem(name, orbit);
                this.addOrbitToSelect(name);
            });

            input.value = "";
        };
        orbitContainer.appendChild(addBtn);

        this.container.appendChild(orbitContainer);
    }

    private addOrbitItem(name: string, orbit: Orbit) {
        const item = document.createElement("div");
        item.className = "ui-list-item";
        item.textContent = name + " ";

        const settingsBtn = document.createElement("button");
        settingsBtn.textContent = "⚙";
        settingsBtn.onclick = () => this.openOrbitSettings(orbit);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.onclick = () => {
            const orbit = this.orbitList.find(o => o.name === name);
            if (!orbit) return Modal(`Orbit "${name}" not found.`, "error");

            this.eventBus.emit("removeOrbit", name, this.orbitList, orbit, (name: string) => {
                item.remove();
                this.removeOrbitFromSelect(name);

                if (this.orbitList.length === 0) {
                    const addComet = document.getElementById("add-comet") as HTMLButtonElement | null;;
                    if (addComet) addComet.disabled = true;
                    const cometSelect = document.getElementById("comet-select");
                    cometSelect?.classList.add("empty");
                }
            });
        };

        const btnsWrap = document.createElement("div");
        btnsWrap.setAttribute("class", "btns-wrap");
        btnsWrap.appendChild(settingsBtn);
        btnsWrap.appendChild(removeBtn);

        item.appendChild(btnsWrap);
        
        this.orbitListContainer.appendChild(item);
    }

    private addOrbitToSelect(name: string) {
        if (!this.orbitSelect) {
            this.orbitSelect = document.createElement("select");
            this.orbitSelect.className = 'ui-select';
            if (this.cometListContainer) this.cometListContainer.appendChild(this.orbitSelect);
        }
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        this.orbitSelect.appendChild(option);
    }

    private removeOrbitFromSelect(name: string) {
        if (!this.orbitSelect) return;
        const options = Array.from(this.orbitSelect.options);
        const opt = options.find(o => o.value === name);
        if (opt) opt.remove();
    }

    private openOrbitSettings(orbit: Orbit) {
        const oldPanel = document.getElementById("orbit-settings-panel");
        if (oldPanel) oldPanel.remove();

        const panel = document.createElement("div");
        panel.id = "orbit-settings-panel";
        panel.className = "ui-orbit-settings";

        panel.innerHTML = `
            <h4 class="ui-section-title">"${orbit.name}" orbit settings</h4>
            <label>Color: <input type="color" value="#${orbit.color.toString(16).padStart(6,'0')}" /></label>
            <label>Radius X: <input type="number" value="${orbit.radiusX}" /></label>
            <label>Radius Z: <input type="number" value="${orbit.radiusZ}" /></label>
            <label>Speed: <input type="number" step="0.001" value="${orbit.speed}" /></label>
            <label>Rotation X: <input type="number" step="0.1" value="${orbit.rotationEuler.x}" /></label>
            <label>Rotation Y: <input type="number" step="0.1" value="${orbit.rotationEuler.y}" /></label>
            <label>Rotation Z: <input type="number" step="0.1" value="${orbit.rotationEuler.z}" /></label>
            <button class="ui-toggle-btn" id="close-settings">✕</button>
        `;

        const colorInput = panel.querySelector<HTMLInputElement>("input[type=color]")!;
        const numberInputs = panel.querySelectorAll<HTMLInputElement>("input[type=number]");
        const radiusXInput = numberInputs[0];
        const radiusZInput = numberInputs[1];
        const speedInput = numberInputs[2];
        const rotationXInput = numberInputs[3];
        const rotationYInput = numberInputs[4];
        const rotationZInput = numberInputs[5];
        const closeBtn = panel.querySelector<HTMLButtonElement>("#close-settings")!;

        colorInput.oninput = () => orbit.setColor(colorInput.value);
        radiusXInput.oninput = () => orbit.setEllipticalX(Number(radiusXInput.value));
        radiusZInput.oninput = () => orbit.setEllipticalZ(Number(radiusZInput.value));
        speedInput.oninput = () => orbit.setSpeed(Number(speedInput.value));
        rotationXInput.oninput = () => orbit.setRotation({ x: Number(rotationXInput.value) });
        rotationYInput.oninput = () => orbit.setRotation({ y: Number(rotationYInput.value) });
        rotationZInput.oninput = () => orbit.setRotation({ z: Number(rotationZInput.value) });
        closeBtn.onclick = () => panel.remove();

        this.container.appendChild(panel);
    }

    private openCometSettings(comet: Comet) {
        const oldPanel = document.getElementById("orbit-settings-panel");
        if (oldPanel) oldPanel.remove();

        const panel = document.createElement("div");
        panel.id = "orbit-settings-panel";
        panel.className = "ui-orbit-settings";

        panel.innerHTML = `
            <h4 class="ui-section-title">"${comet.name}" comet settings</h4>
            <label>Speed: <input type="number" step="0.001" value="${comet.speed}" /></label>
            <label>Radius: <input type="number" step="1" value="${comet.radius}" /></label>
            <label>Distortion: <input type="number" step="0.0001" value="${comet.distortion}" /></label>
            <label>Point count: <input type="number" step="10" value="${comet.pointCount}" /></label>
            <button class="ui-toggle-btn" id="close-settings">✕</button>
        `;

        const numberInputs = panel.querySelectorAll<HTMLInputElement>("input[type=number]");
        const speedInput = numberInputs[0];
        const radiusInput = numberInputs[1];
        const distortionInput = numberInputs[2];
        const pointCountInput = numberInputs[3];
        const closeBtn = panel.querySelector<HTMLButtonElement>("#close-settings")!;

        speedInput.oninput = () => comet.setSpeed(Number(speedInput.value));
        radiusInput.oninput = () => comet.setRadius(Number(radiusInput.value));
        distortionInput.oninput = () => comet.setDistortion(Number(distortionInput.value));
        pointCountInput.oninput = () => comet.setPointCount(Number(pointCountInput.value));
        closeBtn.onclick = () => panel.remove();

        this.container.appendChild(panel);
    }

    private createCometUI() {
        const cometContainer = document.createElement("div");
        cometContainer.className = 'ui-section';
        this.sections.push(cometContainer);

        const title = document.createElement("div");
        title.className = 'ui-section-title';
        title.textContent = "Comets";
        cometContainer.appendChild(title);

        this.cometListContainer = document.createElement("div");
        this.cometListContainer.className = 'ui-list';
        cometContainer.appendChild(this.cometListContainer);

        this.orbitSelect = document.createElement("select");
        this.orbitSelect.setAttribute("id", "comet-select");
        this.orbitSelect.className = `ui-select ${this.orbitList.length === 0 ? "empty" : ""}`;
        cometContainer.appendChild(this.orbitSelect);

        const input = document.createElement("input");
        input.className = 'ui-input';
        input.placeholder = "Comet name";
        cometContainer.appendChild(input);

        const addBtn = document.createElement("button");
        addBtn.setAttribute("id", "add-comet");
        addBtn.className = 'ui-button';
        addBtn.textContent = "Add Comet";
        addBtn.disabled = this.orbitList.length === 0;
        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Comet name required.`, "error");

            const orbitName = this.orbitSelect.value || undefined;
            const exists = this.cometList.find(c => c.name === name);
            if (exists) return Modal(`Comet "${name}" already exists.`, "error");
            
            this.eventBus.emit("addComet", name, orbitName, this.cometList, (name: string) => {
                this.addCometItem(name, orbitName);
            });
            
            input.value = "";
        };
        cometContainer.appendChild(addBtn);

        this.container.appendChild(cometContainer);
    }

    private addCometItem(name: string, orbitName?: string) {
        const item = document.createElement("div");
        item.className = "ui-list-item";
        item.textContent = `${name}${orbitName ? " (Orbit: " + orbitName + ")" : ""} `;

        const comet = this.cometList.find(c => c.name === name);
        const settingsBtn = document.createElement("button");
        settingsBtn.textContent = "⚙";

        if (comet) settingsBtn.onclick = () => this.openCometSettings(comet);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.onclick = () => {
            const comet = this.cometList.find(c => c.name === name);
            if (!comet) return Modal(`Comet "${name}" not found.`, "error");

            this.eventBus.emit("removeComet", name, this.cometList, comet, () => {
                item.remove();
            });
        };

        const btnsWrap = document.createElement("div");
        btnsWrap.setAttribute("class", "btns-wrap");
        btnsWrap.appendChild(settingsBtn);
        btnsWrap.appendChild(removeBtn);

        item.appendChild(btnsWrap);

        this.cometListContainer.appendChild(item);
    }
}
