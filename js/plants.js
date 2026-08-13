// ================================
// PLANT DATA & GROWTH SYSTEM
// ================================

const PLANTS = {
    carrot: {
        id: "carrot",
        name: "Carrot",
        emoji: "🥕",
        rarity: "Common",
        seedPrice: 10,
        sellPrice: 25,
        growthTime: 30,
        waterNeeded: 1,
        xp: 5
    },

    tomato: {
        id: "tomato",
        name: "Tomato",
        emoji: "🍅",
        rarity: "Common",
        seedPrice: 20,
        sellPrice: 50,
        growthTime: 45,
        waterNeeded: 1,
        xp: 8
    },

    corn: {
        id: "corn",
        name: "Corn",
        emoji: "🌽",
        rarity: "Rare",
        seedPrice: 40,
        sellPrice: 100,
        growthTime: 60,
        waterNeeded: 2,
        xp: 12
    },

    strawberry: {
        id: "strawberry",
        name: "Strawberry",
        emoji: "🍓",
        rarity: "Rare",
        seedPrice: 60,
        sellPrice: 150,
        growthTime: 75,
        waterNeeded: 2,
        xp: 15
    },

    pumpkin: {
        id: "pumpkin",
        name: "Pumpkin",
        emoji: "🎃",
        rarity: "Epic",
        seedPrice: 100,
        sellPrice: 280,
        growthTime: 100,
        waterNeeded: 3,
        xp: 25
    },

    watermelon: {
        id: "watermelon",
        name: "Watermelon",
        emoji: "🍉",
        rarity: "Epic",
        seedPrice: 150,
        sellPrice: 400,
        growthTime: 120,
        waterNeeded: 3,
        xp: 35
    },

    sunflower: {
        id: "sunflower",
        name: "Sunflower",
        emoji: "🌻",
        rarity: "Legendary",
        seedPrice: 300,
        sellPrice: 850,
        growthTime: 180,
        waterNeeded: 4,
        xp: 50
    },

    crystalBloom: {
        id: "crystalBloom",
        name: "Crystal Bloom",
        emoji: "💎",
        rarity: "Divine",
        seedPrice: 1000,
        sellPrice: 3000,
        growthTime: 300,
        waterNeeded: 5,
        xp: 100
    }
};


// ================================
// GET PLANT
// ================================

function getPlant(plantId) {
    return PLANTS[plantId] || null;
}


// ================================
// GET ALL PLANTS
// ================================

function getAllPlants() {
    return Object.values(PLANTS);
}


// ================================
// CHECK GROWTH
// ================================

function getGrowthPercent(plant) {
    if (!plant || !plant.plantedAt) {
        return 0;
    }

    const plantData = getPlant(plant.type);

    if (!plantData) {
        return 0;
    }

    const elapsed =
        (Date.now() - plant.plantedAt) / 1000;

    const percent =
        (elapsed / plantData.growthTime) * 100;

    return Math.min(100, Math.max(0, percent));
}


// ================================
// CHECK IF READY
// ================================

function isPlantReady(plant) {
    return getGrowthPercent(plant) >= 100;
}


// ================================
// CREATE NEW PLANT
// ================================

function createPlant(plantType, plotIndex) {
    const plantData = getPlant(plantType);

    if (!plantData) {
        return null;
    }

    return {
        id: crypto.randomUUID(),
        type: plantType,
        plotIndex: plotIndex,
        plantedAt: Date.now(),
        watered: false,
        waterCount: 0,
        ready: false,
        harvested: false
    };
      }
