// ================================
// STORAGE SYSTEM
// ================================

const LOCAL_SAVE_KEY = "garden_grow_save";


// ================================
// CREATE SAVE DATA
// ================================

function createSaveData() {
    if (!window.gameState) {
        return null;
    }

    return JSON.parse(
        JSON.stringify(window.gameState)
    );
}


// ================================
// SAVE GAME LOCALLY
// ================================

function saveGameLocal() {
    const saveData = createSaveData();

    if (!saveData) {
        console.error("Cannot save: gameState does not exist.");
        return false;
    }

    try {
        localStorage.setItem(
            LOCAL_SAVE_KEY,
            JSON.stringify(saveData)
        );

        console.log("Game saved locally.");

        if (typeof showToast === "function") {
            showToast("💾 Game saved!");
        }

        return true;

    } catch (error) {
        console.error(
            "Local save error:",
            error
        );

        return false;
    }
}


// ================================
// LOAD GAME LOCALLY
// ================================

function loadGameLocal() {
    try {
        const savedData =
            localStorage.getItem(LOCAL_SAVE_KEY);

        if (!savedData) {
            console.log("No local save found.");
            return false;
        }

        const parsedData =
            JSON.parse(savedData);

        if (
            !parsedData ||
            typeof parsedData !== "object"
        ) {
            console.error("Invalid save data.");
            return false;
        }

        window.gameState = {
            ...window.gameState,
            ...parsedData
        };

        console.log("Game loaded locally.");

        if (typeof updateGameStateUI === "function") {
            updateGameStateUI();
        }

        return true;

    } catch (error) {
        console.error(
            "Local load error:",
            error
        );

        return false;
    }
}


// ================================
// DELETE LOCAL SAVE
// ================================

function deleteLocalSave() {
    try {
        localStorage.removeItem(
            LOCAL_SAVE_KEY
        );

        console.log("Local save deleted.");

        return true;

    } catch (error) {
        console.error(
            "Delete save error:",
            error
        );

        return false;
    }
}


// ================================
// CHECK LOCAL SAVE
// ================================

function hasLocalSave() {
    return (
        localStorage.getItem(
            LOCAL_SAVE_KEY
        ) !== null
    );
}


// ================================
// RESET GAME STATE
// ================================

function resetGameState() {
    deleteLocalSave();

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

    if (typeof initializeFarm === "function") {
        initializeFarm();
    }

    if (typeof initializeQuests === "function") {
        initializeQuests();
    }

    if (typeof updateGameStateUI === "function") {
        updateGameStateUI();
    }

    console.log("Game state reset.");

    if (typeof showToast === "function") {
        showToast("🔄 Game reset!");
    }
}


// ================================
// AUTO SAVE
// ================================

function autoSaveGame() {
    saveGameLocal();
}


// ================================
// AUTO SAVE TIMER
// ================================

let autoSaveTimer = null;

function startAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }

    autoSaveTimer = setInterval(() => {
        saveGameLocal();
    }, 30000);
}


// ================================
// STOP AUTO SAVE
// ================================

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}


// ================================
// PAGE CLOSE SAVE
// ================================

window.addEventListener("beforeunload", () => {
    saveGameLocal();
});
