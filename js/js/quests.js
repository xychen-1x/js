// ================================
// QUEST SYSTEM
// ================================

const QUESTS = [
    {
        id: "plant_5",
        name: "🌱 Plant 5 Seeds",
        description: "Plant 5 seeds in your garden.",
        target: 5,
        reward: 100,
        type: "plant"
    },
    {
        id: "harvest_5",
        name: "🌾 Harvest 5 Crops",
        description: "Harvest 5 fully grown crops.",
        target: 5,
        reward: 150,
        type: "harvest"
    },
    {
        id: "water_5",
        name: "💧 Water 5 Plants",
        description: "Water 5 plants.",
        target: 5,
        reward: 75,
        type: "water"
    }
];


// ================================
// INITIALIZE QUESTS
// ================================

function initializeQuests() {
    if (!window.gameState) return;

    if (!window.gameState.quests) {
        window.gameState.quests = {};
    }

    QUESTS.forEach(quest => {
        if (!window.gameState.quests[quest.id]) {
            window.gameState.quests[quest.id] = {
                progress: 0,
                completed: false,
                claimed: false
            };
        }
    });
}


// ================================
// GET QUEST
// ================================

function getQuest(questId) {
    return QUESTS.find(quest => quest.id === questId) || null;
}


// ================================
// GET QUEST PROGRESS
// ================================

function getQuestProgress(questId) {
    if (!window.gameState?.quests) return 0;

    return window.gameState.quests[questId]?.progress || 0;
}


// ================================
// UPDATE QUEST PROGRESS
// ================================

function updateQuestProgress(type, amount = 1) {
    if (!window.gameState) return;

    initializeQuests();

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    QUESTS.forEach(quest => {
        if (quest.type !== type) return;

        const progress = window.gameState.quests[quest.id];

        if (!progress || progress.completed) return;

        progress.progress = Math.min(
            quest.target,
            progress.progress + Math.floor(amount)
        );

        if (progress.progress >= quest.target) {
            progress.completed = true;

            if (typeof showToast === "function") {
                showToast(`📋 Quest completed: ${quest.name}`);
            }
        }
    });
}


// ================================
// CLAIM QUEST REWARD
// ================================

function claimQuestReward(questId) {
    if (!window.gameState) return false;

    initializeQuests();

    const quest = getQuest(questId);
    const progress = window.gameState.quests[questId];

    if (!quest || !progress) {
        return false;
    }

    if (!progress.completed || progress.claimed) {
        return false;
    }

    progress.claimed = true;

    if (typeof addCurrency === "function") {
        addCurrency(quest.reward);
    }

    if (typeof addLog === "function") {
        addLog(`🎁 Quest reward: +${quest.reward} Sh`);
    }

    if (typeof showToast === "function") {
        showToast(`🎁 +${quest.reward} Sh`);
    }

    return true;
}


// ================================
// GET ALL QUESTS
// ================================

function getAllQuests() {
    initializeQuests();

    return QUESTS.map(quest => ({
        ...quest,
        progress: getQuestProgress(quest.id),
        completed:
            window.gameState.quests[quest.id]?.completed || false,
        claimed:
            window.gameState.quests[quest.id]?.claimed || false
    }));
}


// ================================
// RESET QUESTS
// ================================

function resetQuests() {
    if (!
