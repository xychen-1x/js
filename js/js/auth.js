// ===============================
// AUTHENTICATION SYSTEM
// ===============================

const authMessage = document.getElementById("auth-message");

function showAuthMessage(message, isError = false) {
    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.style.color = isError ? "#ff7777" : "#79d279";
}

// ===============================
// SHOW LOGIN
// ===============================

function showLoginForm() {
    document.getElementById("login-form").hidden = false;
    document.getElementById("signup-form").hidden = true;

    showAuthMessage("");
}

// ===============================
// SHOW SIGN UP
// ===============================

function showSignupForm() {
    document.getElementById("login-form").hidden = true;
    document.getElementById("signup-form").hidden = false;

    showAuthMessage("");
}

// ===============================
// SIGN UP
// ===============================

async function signUp() {
    const email = document
        .getElementById("signup-email")
        .value
        .trim();

    const password = document
        .getElementById("signup-password")
        .value;

    if (!email || !password) {
        showAuthMessage(
            "Please enter your email and password.",
            true
        );
        return;
    }

    if (password.length < 6) {
        showAuthMessage(
            "Password must be at least 6 characters.",
            true
        );
        return;
    }

    showAuthMessage("Creating account...");

    try {
        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });

        if (error) {
            showAuthMessage(error.message, true);
            return;
        }

        if (data.user) {
            showAuthMessage(
                "Account created! Check your email to confirm your account."
            );
        }

    } catch (error) {
        console.error(error);

        showAuthMessage(
            "Something went wrong while creating your account.",
            true
        );
    }
}

// ===============================
// LOGIN
// ===============================

async function login() {
    const email = document
        .getElementById("login-email")
        .value
        .trim();

    const password = document
        .getElementById("login-password")
        .value;

    if (!email || !password) {
        showAuthMessage(
            "Please enter your email and password.",
            true
        );
        return;
    }

    showAuthMessage("Logging in...");

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            showAuthMessage(error.message, true);
            return;
        }

        if (data.session) {
            showAuthMessage("Login successful!");
        }

    } catch (error) {
        console.error(error);

        showAuthMessage(
            "Something went wrong while logging in.",
            true
        );
    }
}

// ===============================
// LOGOUT
// ===============================

async function logout() {
    try {
        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            return;
        }

        showAuthScreen();

    } catch (error) {
        console.error("Logout error:", error);
    }
}

// ===============================
// SHOW GAME
// ===============================

function showGameScreen() {
    document.getElementById("loading-screen").hidden = true;
    document.getElementById("auth-screen").hidden = true;
    document.getElementById("game-screen").hidden = false;
}

// ===============================
// SHOW AUTH
// ===============================

function showAuthScreen() {
    document.getElementById("loading-screen").hidden = true;
    document.getElementById("game-screen").hidden = true;
    document.getElementById("auth-screen").hidden = false;
}

// ===============================
// AUTH STATE
// ===============================

supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

        if (session && session.user) {
            showGameScreen();
        } else {
            showAuthScreen();
        }

    }
);

// ===============================
// BUTTON EVENTS
// ===============================

document
    .getElementById("login-button")
    .addEventListener("click", login);

document
    .getElementById("signup-button")
    .addEventListener("click", signUp);

document
    .getElementById("show-signup-button")
    .addEventListener("click", showSignupForm);

document
    .getElementById("show-login-button")
    .addEventListener("click", showLoginForm);

document
    .getElementById("logout-button")
    .addEventListener("click", logout);
