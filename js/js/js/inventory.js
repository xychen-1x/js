// ================================
// INVENTORY SYSTEM
// ================================

function initializeInventory() {
    if (!window.gameState) return;

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

    if (!window.gameState.inventory.crops) {
        window.gameState.inventory.crops = {};
    }

    if (!window.gameState.inventory.gear) {
        window.gameState.inventory.gear = {};
    }
}


// ================================
// ADD ITEM
// ================================

function addInventoryItem(type, itemId, amount = 1) {
    initializeInventory();

    amount = Math.floor(Number(amount));

    if (!itemId || !Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    if (!window.gameState.inventory[type]) {
        window.gameState.inventory[type] = {};
    }

    window.gameState.inventory[type][itemId] =
        (window.gameState.inventory[type][itemId] || 0) + amount;

    return true;
}


// ================================
// REMOVE ITEM
// ================================

function removeInventoryItem(type, itemId, amount = 1) {
    initializeInventory();

    amount = Math.floor(Number(amount));

    if (!itemId || !Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    const inventory =
        window.gameState.inventory[type];

    if (!inventory || !inventory[itemId]) {
        return false;
    }

    if (inventory[itemId] < amount) {
        return false;
    }

    inventory[itemId] -= amount;

    if (inventory[itemId] <= 0) {
        delete inventory[itemId];
    }

    return true;
}


// ================================
// GET ITEM COUNT
// ================================

function getInventoryCount(type, itemId) {
    initializeInventory();

    return Number(
        window.gameState.inventory[type]?.[itemId] || 0
    );
}


// ================================
// HAS ITEM
// ================================

function hasInventoryItem(type, itemId, amount = 1) {
    return getInventoryCount(type, itemId) >= amount;
}


// ================================
// ADD SEED
// ================================

function addSeed(plantId, amount = 1) {
    return addInventoryItem("seeds", plantId, amount);
}


// ================================
// REMOVE SEED
// ================================

function removeSeed(plantId, amount = 1) {
    return removeInventoryItem("seeds", plantId, amount);
}


// ================================
// ADD CROP
// ================================

function addInventoryCrop(plantId, amount = 1) {
    return addInventoryItem("crops", plantId, amount);
}


// ================================
// REMOVE CROP
// ================================

function removeInventoryCrop(plantId, amount = 1) {
    return removeInventoryItem("crops", plantId, amount);
}


// ================================
// ADD GEAR
// ================================

function addGear(gearId, amount = 1) {
    return addInventoryItem("gear", gearId, amount);
}


// ================================
// REMOVE GEAR
// ================================

function removeGear(gearId, amount = 1) {
    return removeInventoryItem("gear", gearId, amount);
}


// ================================
// GET TOTAL ITEMS
// ================================

function getTotalInventoryItems() {
    initializeInventory();

    let total = 0;

    const inventory = window.gameState.inventory;

    Object.values(inventory).forEach(category => {
        if (!category) return;

        Object.values(category).forEach(amount => {
            total += Number(amount) || 0;
        });
    });

    return total;
}


// ================================
// CLEAR INVENTORY
// ================================

function clearInventory() {
    if (!window.gameState) return;

    window.gameState.inventory = {
        seeds: {},
        crops: {},
        gear: {}
    };
}


// ================================
// RENDER INVENTORY
// ================================

function renderInventory() {
    const container =
        document.getElementById("inventory");

    if (!container || !window.gameState) {
        return;
    }

    initializeInventory();

    container.innerHTML = "";

    const inventory =
        window.gameState.inventory;

    let hasItems = false;

    Object.entries(inventory).forEach(
        ([type, items]) => {

            Object.entries(items).forEach(
                ([itemId, amount]) => {

                    if (amount <= 0) return;

                    hasItems = true;

                    const item =
                        typeof getPlant === "function" &&
                        type === "seeds"
                            ? getPlant(itemId)
                            : null;

                    const element =
                        document.createElement("div");

                    element
