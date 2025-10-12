const express = require("express");
const app = express();

app.use(express.json());

// In-memory user store
let users = [
    { id: 1, name: "Satyam Singh", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com" }
];
/* -----------------------------
   Helper Functions (reusable)
------------------------------*/

// Validate user payload
function validateUser({ id, name, email }) {
    return id && name && email;
}

// Find user by ID
function findUser(id) {
    return users.find(u => u.id === parseInt(id));
}

// Check if email already exists
function emailExists(email) {
    return users.some(u => u.email === email);
}

// Reset users (for testing/debugging)
function resetUsers() {
    users = [];
    return users;
}

/* -----------------------------
   Routes
------------------------------*/

// 1. Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to User API satya singh 🚀" });
});

// 2. Create user
app.post("/users", (req, res) => {
    const { id, name, email } = req.body;
    if (!validateUser(req.body)) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (emailExists(email)) {
        return res.status(400).json({ error: "Email already exists" });
    }
    users.push({ id, name, email });
    res.status(201).json({ id, name, email });
});

// 3. Get all users
app.get("/users", (req, res) => {
    res.json(users);
});

// Get first user
app.get("/users/first", (req, res) => {
    if (users.length === 0) return res.status(404).json({ error: "No users found" });
    res.json(users[0]);
});

// Get last user
app.get("/users/last", (req, res) => {
    if (users.length === 0) return res.status(404).json({ error: "No users found" });
    res.json(users[users.length - 1]);
});

// 4. Get user by ID
app.get("/users/:id", (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// 5. Update user
app.put("/users/:id", (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, email } = req.body;
    if (email && emailExists(email) && email !== user.email) {
        return res.status(400).json({ error: "Email already in use" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    res.json(user);
});

// 6. Delete user
app.delete("/users/:id", (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: "User deleted" });
});

// 7. Delete all users
app.delete("/users", (req, res) => {
    resetUsers();
    res.json({ message: "All users deleted" });
});

// First and last user routes are defined below


// 8. Count users
app.get("/stats/count", (req, res) => {
    res.json({ count: users.length });
});

// 9. Search user by name
app.get("/search", (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Name query required" });

    const result = users.filter(u =>
        u.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(result);
});

// 10. Filter users by email domain
app.get("/filter/domain", (req, res) => {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: "Domain query required" });

    const result = users.filter(u => u.email.endsWith(`@${domain}`));
    res.json(result);
});

// First and last user routes are defined above

// 13. Update only email
app.patch("/users/:id/email", (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    if (emailExists(email) && email !== user.email) return res.status(400).json({ error: "Email exists" });

    user.email = email;
    res.json(user);
});

// 14. Update only name
app.patch("/users/:id/name", (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    user.name = name;
    res.json(user);
});

// 15. Get user stats (first, last, total count)
app.get("/stats/summary", (req, res) => {
    res.json({
        total: users.length,
        firstUser: users[0] || null,
        lastUser: users[users.length - 1] || null
    });
});

module.exports = app;
