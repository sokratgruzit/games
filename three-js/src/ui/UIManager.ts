import { Orbit } from "../entities/Orbit";
import { Comet } from "../entities/Comet";
import { Modal } from "./Modal";
import { GasCloud } from "../entities/GasCloud";
import { EventBus } from "../core/EventBus";
import { CometTail } from "../entities/CometTail";
import { Planet } from "../entities/Planet";
import { Sun } from "../entities/Sun";

import {
    createEl,
    createBtn,
    createSection,
    createListItem,
    wrapBtns,
    createContainer
} from "../utils/ui";

import './UI.css';

export class UIManager {
    container: HTMLDivElement;
    containerWrap: HTMLDivElement;
    orbitSelect!: HTMLSelectElement;
    orbitSelect2!: HTMLSelectElement;
    cometSelect!: HTMLSelectElement;
    orbitListContainer!: HTMLDivElement;
    cometListContainer!: HTMLDivElement;
    planetsListContainer!: HTMLDivElement;
    sunWrapper!: HTMLDivElement;
    gasListContainer!: HTMLDivElement;
    sections: HTMLDivElement[] = [];

    public orbitList: Orbit[] = [];
    public cometList: Comet[] | CometTail[] = [];
    public gasClouds: GasCloud[] = [];
    public planets: Planet[] = [];
    public sun: Sun | null = null;

    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = createEl("div", "ui-container");
        this.containerWrap = createEl("div", "ui-container-wrap");
        
        createContainer(this.containerWrap, this.container);

        this.createToggleButton();
        this.createOrbitUI();
        this.createSunUI();
        this.createCometUI();
        this.createGasCloudsUI();
        this.createPlanetsUI();

        // сохраняем исходное поведение — слушаем updateComets и обновляем внутренний список + UI списка (без полной перерисовки секции)
        this.eventBus.on("updateComets", (cometList: Comet[] | CometTail[]) => {
            const panel = document.getElementsByClassName("ui-orbit-settings")[0];
            panel?.remove();

            this.cometList = cometList;
            this.renderCometList();
        });
    }

    private createToggleButton() {
        const toogleBtn = () => {
            const orbitSettings = document.getElementById("orbit-settings-panel");
            const collapsed = this.container.classList.toggle("collapsed");
            this.sections.forEach(section => section.classList.toggle("collapsed", collapsed));
            btn.classList.toggle("collapsed", collapsed);

            if (collapsed) orbitSettings?.remove();
        };

        const btn = createBtn("☰", toogleBtn, "ui-toggle-btn");

        this.containerWrap.appendChild(btn);
    }

    // ---------------------------------------------
    // ORBIT UI (создание, добавление в список, select)
    // ---------------------------------------------
    private createOrbitUI() {
        const orbitContainer = createSection("Orbits", this.sections, this.container);

        this.orbitListContainer = createEl("div", "ui-list");
        orbitContainer.appendChild(this.orbitListContainer);

        const input = createEl("input", "ui-input") as HTMLInputElement;
        input.placeholder = "Orbit name";
        orbitContainer.appendChild(input);

        const addOrbit = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Orbit name required.`, "error");

            const exists = this.orbitList.find(o => o.name === name);
            if (exists) return Modal(`Orbit "${name}" already exists.`, "error");

            // сохраняем сигнатуру: (name, orbitList, callback(name, orbit))
            this.eventBus.emit("addOrbit", name, this.orbitList, (name: string, orbit: Orbit) => {
                // внешняя логика создаёт Orbit и передаёт его в callback
                const cometSelect = document.getElementById("comet-select");
                cometSelect?.classList.remove("empty");

                const cometSelect2 = document.getElementById("comet-type-select");
                cometSelect2?.classList.remove("empty");

                const addComet = document.getElementById("add-comet") as HTMLButtonElement | null;
                if (addComet) addComet.disabled = false;

                this.addOrbitItem(name, orbit);
                this.addOrbitToSelect(name);
            });

            input.value = "";
        };

        const addBtn = createBtn("Add orbit", addOrbit, "ui-button");

        orbitContainer.appendChild(addBtn);
    }

    private createGasCloudsUI() {
        const gasContainer = createSection("Gas clouds", this.sections, this.container);

        this.gasListContainer = createEl("div", "ui-list");
        gasContainer.appendChild(this.gasListContainer);

        const input = createEl("input", "ui-input") as HTMLInputElement;
        input.placeholder = "Gas cloud name";
        gasContainer.appendChild(input);

        const addCloud = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Gas cloud name required.`, "error");

            const exists = this.gasClouds.find(o => o.name === name);
            if (exists) return Modal(`Gas cloud "${name}" already exists.`, "error");

            this.eventBus.emit("addGasCloud", name, this.gasClouds, (name: string, cloud: GasCloud) => {
                this.addGasCloudItem(name, cloud);
            });

            input.value = "";
        };
        
        const addBtn = createBtn("Add gas cloud", addCloud, "ui-button");

        gasContainer.appendChild(addBtn);
    }

    private createPlanetsUI() {
        const planetsContainer = createSection("Planets", this.sections, this.container);

        // orbit select (если ранее создан через addOrbitToSelect — используем тот же элемент)
        if (!this.orbitSelect2) {
            this.orbitSelect2 = createEl("select", "ui-select") as HTMLSelectElement;
            this.orbitSelect2.id = "planet-select";
            // если ещё нет орбит — поставить класс empty
            if (this.orbitList.length === 0) this.orbitSelect2.classList.add("empty");
        } else {
            this.orbitSelect2.id = "planet-select";
            if (this.orbitList.length === 0) this.orbitSelect2.classList.add("empty");
            else this.orbitSelect2.classList.remove("empty");
        }

        planetsContainer.appendChild(this.orbitSelect2);

        this.planetsListContainer = createEl("div", "ui-list");
        planetsContainer.appendChild(this.planetsListContainer);

        const input = createEl("input", "ui-input") as HTMLInputElement;
        input.placeholder = "Planet name";
        planetsContainer.appendChild(input);

        const addBtn = createBtn("Add planet");
        addBtn.className = "ui-button";
        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Planet name required.`, "error");

            const exists = this.planets.find(o => o.name === name);
            if (exists) return Modal(`Planet "${name}" already exists.`, "error");

            const orbitName = this.orbitSelect.value || undefined;

            this.eventBus.emit("addPlanet", name, orbitName, this.planets, (name: string) => {
                //this.addCometItem(name, orbitName);
            });

            input.value = "";
        };
        planetsContainer.appendChild(addBtn);
    }

    private createSunUI() {
        const sunContainer = createSection("Sun", this.sections, this.container);

        this.sunWrapper = createEl("div", "ui-list");
        sunContainer.appendChild(this.sunWrapper);

        const input = createEl("input", "ui-input") as HTMLInputElement;
        input.placeholder = "Sun name";
        sunContainer.appendChild(input);

        const addBtn = createBtn("Add sun");
        addBtn.className = "ui-button";
        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Sun name required.`, "error");

            const exists = this.sun?.name === name;
            if (exists) return Modal(`Planet "${name}" already exists.`, "error");

            this.eventBus.emit("addSun", name, this.sun, (name: string) => {
                //this.addCometItem(name, orbitName);
            });

            input.value = "";
        };

        sunContainer.appendChild(addBtn);
    }

    private addOrbitItem(name: string, orbit: Orbit) {
        const item = createListItem(name);

        const settingsBtn = createBtn("⚙", () => this.openOrbitSettings(orbit));
        const removeBtn = createBtn("✕", () => {
            const orbit = this.orbitList.find(o => o.name === name);
            if (!orbit) return Modal(`Orbit "${name}" not found.`, "error");

            // сохраняем сигнатуру: (name, orbitList, orbit, callback(name))
            this.eventBus.emit("removeOrbit", name, this.orbitList, orbit, (name: string) => {
                item.remove();
                this.removeOrbitFromSelect(name);

                if (this.orbitList.length === 0) {
                    const addComet = document.getElementById("add-comet") as HTMLButtonElement | null;
                    if (addComet) addComet.disabled = true;
                    const cometSelect = document.getElementById("comet-select");
                    cometSelect?.classList.add("empty");

                    const cometSelect2 = document.getElementById("comet-type-select");
                    cometSelect2?.classList.add("empty");
                }
            });
        });

        item.appendChild(wrapBtns(settingsBtn, removeBtn));
        this.orbitListContainer.appendChild(item);
    }

    private addGasCloudItem(name: string, cloud: GasCloud) {
        const item = createListItem(name);

        const settingsBtn = createBtn("⚙", () => this.openGasCloudSettings(cloud));
        const removeBtn = createBtn("✕", () => {
            const cloud = this.gasClouds.find(o => o.name === name);
            if (!cloud) return Modal(`Gas cloud "${name}" not found.`, "error");

            // сохраняем сигнатуру: (name, orbitList, orbit, callback(name))
            this.eventBus.emit("removeGasCloud", name, this.gasClouds, cloud, () => {
                item.remove();
            });
        });

        item.appendChild(wrapBtns(settingsBtn, removeBtn));
        this.gasListContainer.appendChild(item);
    }

    private addOrbitToSelect(name: string) {
        // Важно: сохранить прежнее поведение — создать select если его нет и прикрепить к cometListContainer
        if (!this.orbitSelect) {
            this.orbitSelect = createEl("select", "ui-select") as HTMLSelectElement;
            // если cometListContainer ещё не создан — попробуем добавить позже. Но в большинстве случаев cometListContainer уже есть.
            if (this.cometListContainer) {
                this.cometListContainer.appendChild(this.orbitSelect);
            } else {
                // если cometListContainer ещё не создана (например, вызвано до createCometUI) — добавляем в DOM рядом с контейнером
                this.container.appendChild(this.orbitSelect);
            }
        }
        const option = new Option(name, name);
        this.orbitSelect.appendChild(option);
    }

    private removeOrbitFromSelect(name: string) {
        if (!this.orbitSelect) return;
        const options = Array.from(this.orbitSelect.options);
        const opt = options.find(o => o.value === name);
        if (opt) opt.remove();
    }

    // ---------------------------------------------
    // Orbit settings panel (сохраняем оригинальную логику)
    // ---------------------------------------------
    private openOrbitSettings(orbit: Orbit) {
        const oldPanel = document.getElementById("orbit-settings-panel");
        if (oldPanel) oldPanel.remove();

        const panel = createEl("div", "ui-orbit-settings") as HTMLDivElement;
        panel.id = "orbit-settings-panel";

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

    private openGasCloudSettings(cloud: GasCloud) {
        const oldPanel = document.getElementById("cloud-settings-panel");
        if (oldPanel) oldPanel.remove();

        const panel = createEl("div", "ui-orbit-settings") as HTMLDivElement;
        panel.id = "cloud-settings-panel";

        panel.innerHTML = `
            <h4 class="ui-section-title">"${cloud.name}" orbit settings</h4>
            <label>Color: <input type="color" value="${cloud.color}" /></label>
            <label>Particles count: <input type="number" value="${cloud.count}" /></label>
            <label>Scale X: <input type="number" value="${cloud.scaleX}" /></label>
            <label>Scale Y: <input type="number" value="${cloud.scaleY}" /></label>
            <label>Scale Z: <input type="number" value="${cloud.scaleZ}" /></label>
            <label>Position X: <input type="number" value="${cloud.posX}" /></label>
            <label>Position Y: <input type="number" value="${cloud.posY}" /></label>
            <label>Position Z: <input type="number" value="${cloud.posZ}" /></label>
            <label>Speed: <input type="number" step="0.0001" value="${cloud.speed}" /></label>
            <button class="ui-toggle-btn" id="close-settings">✕</button>
        `;

        const colorInput = panel.querySelector<HTMLInputElement>("input[type=color]")!;
        const numberInputs = panel.querySelectorAll<HTMLInputElement>("input[type=number]");
        const countInput = numberInputs[0];
        const scaleXInput = numberInputs[1];
        const scaleYInput = numberInputs[2];
        const scaleZInput = numberInputs[3];
        const posXInput = numberInputs[4];
        const posYInput = numberInputs[5];
        const posZInput = numberInputs[6];
        const speedInput = numberInputs[7];
        const closeBtn = panel.querySelector<HTMLButtonElement>("#close-settings")!;

        colorInput.oninput = () => cloud.setColor(colorInput.value);
        countInput.oninput = () => cloud.setCount(Number(countInput.value));
        scaleXInput.oninput = () => cloud.setScale({ x: Number(scaleXInput.value) });
        scaleYInput.oninput = () => cloud.setScale({ y: Number(scaleYInput.value) });
        scaleZInput.oninput = () => cloud.setScale({ z: Number(scaleZInput.value) });
        posXInput.oninput = () => cloud.setPosition({ x: Number(posXInput.value) });
        posYInput.oninput = () => cloud.setPosition({ y: Number(posYInput.value) });
        posZInput.oninput = () => cloud.setPosition({ z: Number(posZInput.value) });
        speedInput.oninput = () => cloud.setSpeed(Number(speedInput.value));
        closeBtn.onclick = () => panel.remove();

        this.container.appendChild(panel);
    }

    // ---------------------------------------------
    // COMETS UI
    // ---------------------------------------------
    private createCometUI() {
        const cometContainer = createSection("Comets", this.sections, this.container);

        this.cometListContainer = createEl("div", "ui-list");
        cometContainer.appendChild(this.cometListContainer);

        // orbit select (если ранее создан через addOrbitToSelect — используем тот же элемент)
        if (!this.orbitSelect) {
            this.orbitSelect = createEl("select", "ui-select") as HTMLSelectElement;
            this.orbitSelect.id = "comet-select";
            // если ещё нет орбит — поставить класс empty
            if (this.orbitList.length === 0) this.orbitSelect.classList.add("empty");
        } else {
            this.orbitSelect.id = "comet-select";
            if (this.orbitList.length === 0) this.orbitSelect.classList.add("empty");
            else this.orbitSelect.classList.remove("empty");
        }
        cometContainer.appendChild(this.orbitSelect);

        // comet type select
        this.cometSelect = createEl("select", `ui-select ${this.orbitList.length === 0 ? "empty" : ""}`) as HTMLSelectElement;
        this.cometSelect.id = "comet-type-select";

        const option = new Option("Tailed comet", "tail");
        const option2 = new Option("Round comet", "round");
        this.cometSelect.appendChild(option);
        this.cometSelect.appendChild(option2);

        cometContainer.appendChild(this.cometSelect);

        const input = createEl("input", "ui-input") as HTMLInputElement;
        input.placeholder = "Comet name";
        cometContainer.appendChild(input);

        const addBtn = createBtn("Add comet") as HTMLButtonElement;
        addBtn.id = "add-comet";
        addBtn.className = "ui-button";
        addBtn.disabled = this.orbitList.length === 0;
        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return Modal(`Comet name required.`, "error");

            const orbitName = this.orbitSelect.value || undefined;
            const exists = this.cometList.find(c => c.name === name);
            if (exists) return Modal(`Comet "${name}" already exists.`, "error");

            // сохраняем сигнатуру: (name, orbitName, cometList, cometType, callback(name))
            this.eventBus.emit("addComet", name, orbitName, this.cometList, this.cometSelect.value, (name: string) => {
                this.addCometItem(name, orbitName);
            });

            input.value = "";
        };
        cometContainer.appendChild(addBtn);

        // первоначальная отрисовка существующих комет
        this.renderCometList();
    }

    private renderCometList() {
        if (!this.cometListContainer) return;
        // минимальная операция: очищаем контейнер списка и рендерим только элементы списка (не пересоздаём секцию)
        this.cometListContainer.innerHTML = "";
        for (const c of this.cometList) {
            // some comet objects may have orbitName attached externally — попытаться взять его, иначе undefined
            const orbitName = (c as any).orbitName;
            this.addCometItem(c.name, orbitName);
        }
    }

    private addCometItem(name: string, orbitName?: string) {
        const itemText = `${name}${orbitName ? " (Orbit: " + orbitName + ")" : ""} `;
        const item = createListItem(itemText);

        const comet = this.cometList.find(c => c.name === name);
        const settingsBtn = createBtn("⚙");
        if (comet) settingsBtn.onclick = () => this.openCometSettings(comet);

        const removeBtn = createBtn("✕");
        removeBtn.onclick = () => {
            const comet = this.cometList.find(c => c.name === name);
            if (!comet) return Modal(`Comet "${name}" not found.`, "error");

            // сохраняем сигнатуру: (name, cometList, comet, callback())
            this.eventBus.emit("removeComet", name, this.cometList, comet, () => {
                item.remove();
            });
        };

        item.appendChild(wrapBtns(settingsBtn, removeBtn));
        this.cometListContainer.appendChild(item);
    }

    // ---------------------------------------------
    // Comet settings panel (сохраняем оригинальную логику)
    // ---------------------------------------------
    private openCometSettings(comet: Comet | CometTail) {
        const oldPanel = document.getElementById("orbit-settings-panel");
        if (oldPanel) oldPanel.remove();

        const panel = createEl("div", "ui-orbit-settings") as HTMLDivElement;
        panel.id = "orbit-settings-panel";

        // различаем по свойствам — как было в оригинале
        if ("distortion" in comet && (comet as any).type === "round") {
            panel.innerHTML = `
                <h4 class="ui-section-title">"${comet.name}" comet settings</h4>
                <label>Speed: <input type="number" step="0.001" value="${(comet as any).speed}" /></label>
                <label>Radius: <input type="number" step="1" value="${(comet as any).radius}" /></label>
                <label>Distortion: <input type="number" step="0.0001" value="${(comet as any).distortion}" /></label>
                <label>Point count: <input type="number" step="10" value="${(comet as any).pointCount}" /></label>
                <button class="ui-toggle-btn" id="close-settings">✕</button>
            `;
        } else if ("tailCount" in comet && (comet as any).type === "tail") {
            panel.innerHTML = `
                <h4 class="ui-section-title">"${comet.name}" comet settings</h4>
                <label>Head color: <input type="color" value="#${(comet as any).colorStart.getHexString()}" /></label>
                <label>Tail color: <input type="color" value="#${(comet as any).colorEnd.getHexString()}" /></label>
                <label>Speed: <input type="number" step="0.001" value="${(comet as any).speed}" /></label>
                <label>Radius: <input type="number" step="1" value="${(comet as any).radius}" /></label>
                <label>Tail count: <input type="number" step="1" value="${(comet as any).tailCount}" /></label>
                <button class="ui-toggle-btn" id="close-settings">✕</button>
            `;
        } else {
            // На всякий случай — если структура другая, показываем базовый панель
            panel.innerHTML = `
                <h4 class="ui-section-title">"${(comet as any).name || "Comet"}" settings</h4>
                <button class="ui-toggle-btn" id="close-settings">✕</button>
            `;
        }

        const numberInputs = panel.querySelectorAll<HTMLInputElement>("input[type=number]");
        const colorInputs = panel.querySelectorAll<HTMLInputElement>("input[type=color]");

        if ("distortion" in comet && (comet as any).type === "round") {
            const speedInput = numberInputs[0];
            const radiusInput = numberInputs[1];
            const distortionInput = numberInputs[2];
            const pointCountInput = numberInputs[3];

            speedInput.oninput = () => (comet as any).setSpeed(Number(speedInput.value));
            radiusInput.oninput = () => (comet as any).setRadius(Number(radiusInput.value));
            distortionInput.oninput = () => (comet as any).setDistortion(Number(distortionInput.value));
            pointCountInput.oninput = () => (comet as any).setPointCount(Number(pointCountInput.value));
        } else if ("tailCount" in comet && (comet as any).type === "tail") {
            const startColorInput = colorInputs[0];
            const endColorInput = colorInputs[1];
            const speedInput = numberInputs[0];
            const radiusInput = numberInputs[1];
            const tailCountInput = numberInputs[2];

            startColorInput.oninput = () => (comet as any).setStartColor(startColorInput.value);
            endColorInput.oninput = () => (comet as any).setEndColor(endColorInput.value);
            speedInput.oninput = () => (comet as any).setSpeed(Number(speedInput.value));
            radiusInput.oninput = () => (comet as any).setRadius(Number(radiusInput.value));
            tailCountInput.oninput = () => (comet as any).setTailCount(Number(tailCountInput.value));
        }

        const closeBtn = panel.querySelector<HTMLButtonElement>("#close-settings")!;
        closeBtn.onclick = () => panel.remove();

        this.container.appendChild(panel);
    }
}
