// ================================
// VISUAL EFFECTS SYSTEM
// ================================

function showToast(message, duration = 2000) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}


// ================================
// PARTICLE EFFECT
// ================================

function createParticle(x, y, emoji = "✨") {
    const particle = document.createElement("div");

    particle.textContent = emoji;

    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9999";
    particle.style.fontSize = "20px";
    particle.style.transition =
        "transform 0.8s ease-out, opacity 0.8s ease-out";

    document.body.appendChild(particle);

    requestAnimationFrame(() => {
        particle.style.transform =
            "translateY(-50px) scale(1.3)";
        particle.style.opacity = "0";
    });

    setTimeout(() => {
        particle.remove();
    }, 800);
}


// ================================
// CLICK EFFECT
// ================================

function clickEffect(element, emoji = "✨") {
    if (!element) return;

    const rect = element.getBoundingClientRect();

    createParticle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        emoji
    );
}


// ================================
// PLANT EFFECT
// ================================

function plantEffect(element) {
    clickEffect(element, "🌱");
}


// ================================
// WATER EFFECT
// ================================

function waterEffect(element) {
    clickEffect(element, "💧");
}


// ================================
// HARVEST EFFECT
// ================================

function harvestEffect(element) {
    clickEffect(element, "✨");
}


// ================================
// MONEY EFFECT
// ================================

function moneyEffect(element) {
    clickEffect(element, "💰");
}


// ================================
// LEVEL UP EFFECT
// ================================

function levelUpEffect() {
    showToast("🎉 Level Up!");

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createParticle(
                window.innerWidth / 2 +
                    (Math.random() * 160 - 80),
                window.innerHeight / 2 +
                    (Math.random() * 100 - 50),
                "⭐"
            );
        }, i * 80);
    }
}
