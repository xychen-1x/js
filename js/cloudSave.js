// ================================
// CLOUD SAVE SYSTEM
// ================================

async function saveGameToCloud(saveData) {
    if (!currentUser) {
        console.log("No logged-in user. Cloud save skipped.");
        return false;
    }

    try {
        const { data, error } = await supabaseClient
            .from("game_saves")
            .upsert(
                {
                    user_id: currentUser.id,
                    save_data: saveData,
                    save_version: 1,
                    last_played_at: new Date().toISOString()
                },
                {
                    onConflict: "user_id"
                }
            )
            .select()
            .single();

        if (error) {
            console.error("Cloud save error:", error);
            return false;
        }

        console.log("Game saved to Supabase:", data);
        return true;

    } catch (error) {
        console.error("Cloud save exception:", error);
        return false;
    }
}


// ================================
// LOAD GAME FROM CLOUD
// ================================

async function loadGameFromCloud() {
    if (!currentUser) {
        console.log("No logged-in user. Cloud load skipped.");
        return null;
    }

    try {
        const { data, error } = await supabaseClient
            .from("game_saves")
            .select("save_data, save_version, updated_at")
            .eq("user_id", currentUser.id)
            .maybeSingle();

        if (error) {
            console.error("Cloud load error:", error);
            return null;
        }

        if (!data) {
            console.log("No cloud save found.");
            return null;
        }

        console.log("Cloud save loaded.");

        return data;

    } catch (error) {
        console.error("Cloud load exception:", error);
        return null;
    }
}


// ================================
// CHECK IF CLOUD SAVE EXISTS
// ================================

async function hasCloudSave() {
    if (!currentUser) {
        return false;
    }

    const { data, error } = await supabaseClient
        .from("game_saves")
        .select("id")
        .eq("user_id", currentUser.id)
        .maybeSingle();

    if (error) {
        console.error("Cloud save check error:", error);
        return false;
    }

    return !!data;
                    }
