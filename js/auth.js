// ==================== AUTHENTICATION ====================

let currentUser = null;

// Get important HTML elements
const loadingScreen = document.getElementById("loading-screen");
const authScreen = document.getElementById("auth-screen");
const gameContainer = document.getElementById("game-container");

// Show login screen
function showLogin() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";
}

// Show signup screen
function showSignup() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "block";
}

// Display authentication screen
function showAuthScreen() {
    if (loadingScreen) loadingScreen.style.display = "none";
    if (authScreen) authScreen.style.display = "flex";
    if (gameContainer) gameContainer.style.display = "none";

    showLogin();
}

// Display game
function showGame() {
    if (loadingScreen) loadingScreen.style.display = "none";
    if (authScreen) authScreen.style.display = "none";
    if (gameContainer) gameContainer.style.display = "block";
}

// Show a simple message
function authMessage(message) {
    alert(message);
}

// ==================== SIGN UP ====================

async function handleSignup() {
    const email = document.getElementById("signup-email")?.value.trim();
    const password = document.getElementById("signup-password")?.value;

    if (!email || !password) {
        authMessage("Please enter your email and password.");
        return;
    }

    if (password.length < 6) {
        authMessage("Password must be at least 6 characters.");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            console.error("Signup error:", error);
            authMessage(error.message);
            return;
        }

        // Email confirmation is enabled in Supabase
        if (data.user && !data.session) {
            authMessage(
                "Account created! Please check your email and confirm your account before logging in."
            );
            showLogin();
            return;
        }

        if (data.session) {
            currentUser = data.user;
            showGame();
        }

    } catch (error) {
        console.error("Signup exception:", error);
        authMessage("Something went wrong during signup.");
    }
}

// ==================== LOGIN ====================

async function handleLogin() {
    const email = document.getElementById("login-email")?.value.trim();
    const password = document.getElementById("login-password")?.value;

    if (!email || !password) {
        authMessage("Please enter your email and password.");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error("Login error:", error);
            authMessage(error.message);
            return;
        }

        currentUser = data.user;

        showGame();

        console.log("Logged in:", currentUser.id);

        // Cloud save loading will be connected later.
        // Do not add it yet.

    } catch (error) {
        console.error("Login exception:", error);
        authMessage("Something went wrong during login.");
    }
}

// ==================== LOGOUT ====================

async function handleLogout() {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            authMessage(error.message);
            return;
        }

        currentUser = null;

        showAuthScreen();

    } catch (error) {
        console.error("Logout exception:", error);
        authMessage("Something went wrong during logout.");
    }
}

// ==================== SESSION CHECK ====================

async function checkAuthSession() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Session error:", error);
            showAuthScreen();
            return;
        }

        if (data.session && data.session.user) {
            currentUser = data.session.user;

            console.log("Existing session found:", currentUser.id);

            showGame();
        } else {
            showAuthScreen();
        }

    } catch (error) {
        console.error("Session check exception:", error);
        showAuthScreen();
    }
}

// ==================== AUTH STATE LISTENER ====================

supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);

    if (session && session.user) {
        currentUser = session.user;
    } else {
currentUser = null;
    }
});

// ==================== INITIALIZE AUTH ====================

document.addEventListener("DOMContentLoaded", () => {
    checkAuthSession();
});
// ================================
// AUTHENTICATION SYSTEM
// ================================

// SIGN UP
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error("Sign up error:", error.message);
        alert(error.message);
        return false;
    }

    alert("Account created! Please check your email to confirm your account.");
    return true;
}

// LOGIN
async function login(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("Login error:", error.message);
        alert(error.message);
        return false;
    }

    console.log("Logged in:", data.user.email);
    return true;
}

// LOGOUT
async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
        return false;
    }

    console.log("Logged out.");
    return true;
}

// GET CURRENT USER
async function getCurrentUser() {
    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    return user;
}

// LISTEN FOR AUTH CHANGES
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);

    if (session) {
        console.log("User logged in:", session.user.email);
    } else {
        console.log("No user logged in.");
    }
});
