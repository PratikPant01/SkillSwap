/**
 * Award credits to a user and log the transaction.
 * @param {object} db - DB Pool or Client
 * @param {number} userId - User ID
 * @param {number} amount - Amount to award
 * @param {string} type - Transaction type (BONUS, EARNED, SPENT)
 * @param {string} description - Transaction description
 */
export async function awardCredits(db, userId, amount, type, description) {
    // Check if db is a Pool or a Client
    // Pools have a 'connect' method but also tracking properties like 'totalCount'
    const isPool = typeof db.connect === 'function' && db.totalCount !== undefined;

    let client;
    let shouldRelease = false;
    let shouldHandleTransaction = false;

    if (isPool) {
        client = await db.connect();
        shouldRelease = true;
        shouldHandleTransaction = true;
    } else {
        client = db;
        shouldRelease = false;
        shouldHandleTransaction = false; // Assume caller handles transaction if passing a client
    }

    try {
        if (shouldHandleTransaction) {
            await client.query("BEGIN");
        }

        // Update user credits
        await client.query(
            "UPDATE users SET credits = credits + $1 WHERE id = $2",
            [amount, userId]
        );

        // Log to history
        await client.query(
            "INSERT INTO credit_history (user_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)",
            [userId, amount, type, description]
        );

        if (shouldHandleTransaction) {
            await client.query("COMMIT");
        }
        return true;
    } catch (err) {
        if (shouldHandleTransaction) {
            await client.query("ROLLBACK");
        }
        console.error("Error awarding credits:", err);
        return false;
    } finally {
        if (shouldRelease) {
            client.release();
        }
    }
}
