import { checkUser } from "@/lib/checkUser"

export async function AuthCheck() {
    try {
        await checkUser();
    } catch (error) {
        // Silent error handling - errors will be shown in components that need the user data
        console.error("AuthCheck: User sync failed:", error.message);
    }
    return null;
}