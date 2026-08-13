// ================================
// ECONOMY SYSTEM
// ================================

const STARTING_CURRENCY = 500;


// ================================
// GET PLAYER CURRENCY
// ================================

function getCurrency() {
    if (!window.gameState) {
        return 0;
    }

    return Number(window.gameState.currency) || 0;
}


// ================================
// ADD CURRENCY
// ================================

function addCurrency(amount) {
    if (!window.gameState) return false;

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    window.gameState.currency =
        getCurrency() + Math.floor(amount);

    return true;
}


// ================================
// REMOVE CURRENCY
// ================================

function removeCurrency(amount) {
    if (!window.gameState) return false;

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    if (getCurrency() < amount) {
        return false;
    }

    window.gameState.currency =
        getCurrency() - Math.floor(amount);

    return true;
}


// ================================
// CAN AFFORD
// ================================

function canAfford(amount) {
    return getCurrency() >= Number(amount);
}


// ================================
// BUY SEED
// ================================

function buySeed(plantId, quantity = 1) {
    if (!window.gameState) return false;

    const plant = getPlant(plantId);

    if (!plant) {
        console.error("Unknown plant:", plantId);
        return false;
    }

    quantity = Math.floor(Number(quantity));

    if (!Number.isFinite(quantity) || quantity <= 0) {
        return false;
    }

    const totalCost = plant.seedPrice * quantity;

    if (!canAfford(totalCost)) {
        console.log("Not enough Sheckles.");
        return false;
    }

    if (!window.gameState.inventory) {
        window.gameState.inventory = {
            seeds: {},
            crops: {},
            gear: {}
        };
    }

    if (!window.gameState.inventory.seeds) {
        window.gameState.inventory.seeds = {};
    }

    removeCurrency(totalCost);

    window.gameState.inventory.seeds[plantId] =
        (window.gameState.inventory.seeds[plantId] || 0) + quantity;

    return true;
}


// ================================
// USE SEED
// ================================

function useSeed(plantId) {
    if (!window.gameState) return false;

    const seeds = window.gameState.inventory?.seeds;

    if (!seeds || !seeds[plantId] || seeds[plantId] <= 0) {
        return false;
    }

    seeds[plantId]--;

    if (seeds[plantId] <= 0) {
        delete seeds[plantId];
    }

    return true;
}


// ================================
// ADD CROP
// ================================

function addCrop(plantId, quantity = 1) {
    if (!window.gameState) return false;

    if (!window.gameState.inventory) {
        window.gameState.inventory = {
            seeds: {},
            crops: {},
            gear: {}
        };
    }

    if (!window.gameState.inventory.crops) {
        window.gameState.inventory.crops = {};
    }

    quantity = Math.floor(Number(quantity));

    if (!Number.isFinite(quantity) || quantity <= 0) {
        return false;
    }

    window.gameState.inventory.crops[plantId] =
        (window.gameState.inventory.crops[plantId] || 0) + quantity;

    return true;
}


// ================================
// SELL CROP
// ================================

function sellCrop(plantId, quantity = 1) {
    if (!window.gameState) return false;

    const plant = getPlant(plantId);

    if (!plant) {
        return false;
    }

    const crops = window.gameState.inventory?.crops;

    if (!crops || !crops[plantId]) {
        return false;
    }

    quantity = Math.floor(Number(quantity));

    if (!Number.isFinite(quantity) || quantity <= 0) {
        return false;
    }

    const available = crops[plantId];

    if (available < quantity) {
        return false;
    }

    const earnings = plant.sellPrice * quantity;

    crops[plantId] -=
