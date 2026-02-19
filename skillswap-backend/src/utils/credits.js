/**
 * Award credits to a user and log the transaction.
 * @param {object} pool - DB Pool
 * @param {number} userId - User ID
 * @param {number} amount - Amount to award
 * @param {string} type - Transaction type (BONUS, EARNED, SPENT)
 * @param {string} description - Transaction description
 */
export async function awardCredits(pool, userId, amount, type, description) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

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

        await client.query("COMMIT");
        return true;
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error awarding credits:", err);
        return false;
    } finally {
        client.release();
    }
}
