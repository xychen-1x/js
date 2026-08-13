// ================================
// GAME STATE SYSTEM
// ================================

window.gameState = {
    currency: 500,

    level: 1,

    xp: 0,

    xpNeeded: 100,

    farmLevel: 1,

    water: 10,

    maxWater: 10,

    selectedPlant: "carrot",

    selectedTool: "plant",

    inventory: {
        seeds: {},
        crops: {},
        gear: {}
    },

    farm: [],

    quests: {},

    weather: {
        id: "sunny",
        name: "Sunny"
    }
};


// ================================
// CREATE EMPTY FARM
// ================================

function initializeFarm(size = 16) {
    if (!Array.isArray(window.gameState.farm)) {
        window.gameState.farm = [];
    }

    while (window.gameState.farm.length < size) {
        window.gameState.farm.push(null);
    }

    if (window.gameState.farm.length > size) {
        window.gameState.farm =
            window.gameState.farm.slice(0, size);
    }
}


// ================================
// ADD XP
// ================================

function addXP(amount) {
    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    window.gameState.xp += Math.floor(amount);

    while (
        window.gameState.xp >=
        window.gameState.xpNeeded
    ) {
        window.gameState.xp -=
            window.gameState.xpNeeded;

        levelUp();
    }

    updateGameStateUI();
}


// ================================
// LEVEL UP
// ================================

function levelUp() {
    window.gameState.level++;

    window.gameState.xpNeeded =
        Math.floor(
            window.gameState.xpNeeded * 1.25
        );

    if (typeof levelUpEffect === "function") {
        levelUpEffect();
    }

    if (typeof addLog === "function") {
        addLog(
            `⭐ Level up! You are now level ${window.gameState.level}.`
        );
    }
}


// ================================
// SET SELECTED PLANT
// ================================

function setSelectedPlant(plantId) {
    window.gameState.selectedPlant = plantId;

    updateGameStateUI();
}


// ================================
// SET SELECTED TOOL
// ================================

function setSelectedTool(tool) {
    window.gameState.selectedTool = tool;

    updateGameStateUI();
}


// ================================
// USE WATER
// ================================

function useWater(amount = 1) {
    amount = Math.floor(Number(amount));

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return false;
    }

    if (window.gameState.water < amount) {
        return false;
    }

    window.gameState.water -= amount;

    updateGameStateUI();

    return true;
}


// ================================
// ADD WATER
// ================================

function addWater(amount = 1) {
    amount = Math.floor(Number(amount));

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return false;
    }

    window.gameState.water =
        Math.min(
            window.gameState.maxWater,
            window.gameState.water + amount
        );

    updateGameStateUI();

    return true;
}


// ================================
// UPDATE UI
// ================================

function updateGameStateUI() {
    const currency =
        document.getElementById("sheckles");

    const level =
        document.getElementById("level");

    const farmLevel =
        document.getElementById("farmLevel");

    const water =
        document.getElementById("waterDisplay");

    const xpFill =
        document.getElementById("xpFill");

    const xpText =
        document.getElementById("xpText");

    const xpNeeded =
        document.getElementById("xpNeeded");

    if (currency) {
        currency.textContent =
            window.gameState.currency;
    }

    if (level) {
        level.textContent =
            window.gameState.level;
    }

    if (farmLevel) {
        farmLevel.textContent =
            window.gameState.farmLevel;
    }

    if (water) {
        water.textContent =
            `${window.gameState.water}/${window.gameState.maxWater}`;
    }

    if (xpText) {
        xpText.textContent =
            window.gameState.xp;
    }

    if (xpNeeded) {
        xpNeeded.textContent =
            window.gameState.xpNeeded;
    }

    if (xpFill) {
        const percentage =
            (
                window.gameState.xp /
                window.gameState.xpNeeded
            ) * 100;

        xpFill.style.width =
            `${Math.min(100, percentage)}%`;
    }
}


// ================================
// INITIALIZE GAME STATE
// ================================

function initializeGameState() {
    initializeFarm();

    if (typeof initializeQuests === "function") {
        initializeQuests();
    }

    updateGameStateUI();
}


// ================================
// START
// ================================

document.addEventListener(
    "DOMContentLoaded",
    initializeGameState
);
