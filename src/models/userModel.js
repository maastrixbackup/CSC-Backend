const db = require("../config/db");

const User = {
    async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.query(
            "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
            [id]
        );

        return rows[0];
    },

};

module.exports = User;