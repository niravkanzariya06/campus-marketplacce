import cron from "node-cron";
import { sql } from "../db/index.js";

export const startCleanupJob = () => {
    // Hourly — deletes unverified expired accounts
    cron.schedule("0 * * * *", async () => {
        try {
            const deleted = await sql`
                DELETE FROM users
                WHERE is_verified = false
                AND verification_token_expiry < NOW()
                RETURNING id
            `;
            if (deleted.length > 0) {
                console.log(`[Cleanup] Deleted ${deleted.length} unverified expired account(s)`);
            }
        } catch (error) {
            console.error("[Cleanup] Error:", error.message);
        }
    });

    // Every 15 minutes — cleans expired OTP rows
    cron.schedule("*/15 * * * *", async () => {
        try {
            const deleted = await sql`
                DELETE FROM otps
                WHERE expiry < NOW()
                AND reset_token IS NULL
            `;
            if (deleted.length > 0) {
                console.log(`[Cleanup] Deleted ${deleted.rowCount || deleted.length} expired OTP row(s)`);
            }
        } catch (error) {
            console.error("[Cleanup] OTP error:", error.message);
        }
    });
};
