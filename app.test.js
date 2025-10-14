const request = require("supertest");
const app = require("./app");

// Reset data before each test
beforeEach(() => {
    // Hit delete all route before running each test
    return request(app).delete("/users");
});



describe("User API", () => {
    it("should return welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Welcome to User API Satyam Singh  from test 🚀");
    });

    it("should create a user", async () => {
        const res = await request(app).post("/users").send({
            id: 1,
            name: "Alice",
            email: "alice@example.com"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Alice");
    });

    it("should not create user with missing fields", async () => {
        const res = await request(app).post("/users").send({ name: "Bob" });
        expect(res.statusCode).toBe(400);
    });

    it("should not create user with duplicate email", async () => {
        await request(app).post("/users").send({
            id: 1,
            name: "Alice",
            email: "alice@example.com"
        });
        const res = await request(app).post("/users").send({
            id: 2,
            name: "Bob",
            email: "alice@example.com"
        });
        expect(res.statusCode).toBe(400);
    });

    it("should fetch all users", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).get("/users");
        expect(res.body.length).toBe(1);
    });

    it("should fetch a user by ID", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).get("/users/1");
        expect(res.body.email).toBe("a@test.com");
    });

    it("should return 404 for invalid user ID", async () => {
        const res = await request(app).get("/users/99");
        expect(res.statusCode).toBe(404);
    });

    it("should update a user", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).put("/users/1").send({ name: "A-updated" });
        expect(res.body.name).toBe("A-updated");
    });

    it("should not update if email already exists", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        await request(app).post("/users").send({ id: 2, name: "B", email: "b@test.com" });
        const res = await request(app).put("/users/2").send({ email: "a@test.com" });
        expect(res.statusCode).toBe(400);
    });

    it("should delete a user", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).delete("/users/1");
        expect(res.body.message).toBe("User deleted");
    });

    it("should return 404 when deleting non-existing user", async () => {
        const res = await request(app).delete("/users/123");
        expect(res.statusCode).toBe(404);
    });

    it("should delete all users", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).delete("/users");
        expect(res.body.message).toBe("All users deleted");
    });

    it("should return user count", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).get("/stats/count");
        expect(res.body.count).toBe(1);
    });

    it("should search users by name", async () => {
        await request(app).post("/users").send({ id: 1, name: "Alice", email: "alice@test.com" });
        const res = await request(app).get("/search?name=ali");
        expect(res.body[0].name).toBe("Alice");
    });

    it("should filter users by email domain", async () => {
        await request(app).post("/users").send({ id: 1, name: "Alice", email: "alice@gmail.com" });
        const res = await request(app).get("/filter/domain?domain=gmail.com");
        expect(res.body[0].email).toContain("@gmail.com");
    });

    it("should return first user", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        await request(app).post("/users").send({ id: 2, name: "B", email: "b@test.com" });
        const res = await request(app).get("/users/first");
        expect(res.body.id).toBe(1);
    });

    it("should return last user", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        await request(app).post("/users").send({ id: 2, name: "B", email: "b@test.com" });
        const res = await request(app).get("/users/last");
        expect(res.body.id).toBe(2);
    });

    it("should patch user email", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).patch("/users/1/email").send({ email: "new@test.com" });
        expect(res.body.email).toBe("new@test.com");
    });
    
    it("should allow patching to same email", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).patch("/users/1/email").send({ email: "a@test.com" });
        expect(res.body.email).toBe("a@test.com");
    });
    
    it("should return 400 when email is missing in patch request", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).patch("/users/1/email").send({});
        expect(res.statusCode).toBe(400);
    });

    it("should patch user name", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).patch("/users/1/name").send({ name: "Updated" });
        expect(res.body.name).toBe("Updated");
    });
    

    
    it("should return 400 when name is missing in patch request", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        const res = await request(app).patch("/users/1/name").send({});
        expect(res.statusCode).toBe(400);
    });

    it("should return stats summary", async () => {
        await request(app).post("/users").send({ id: 1, name: "A", email: "a@test.com" });
        await request(app).post("/users").send({ id: 2, name: "B", email: "b@test.com" });
        const res = await request(app).get("/stats/summary");
        expect(res.body.total).toBe(2);
        expect(res.body.firstUser.id).toBe(1);
        expect(res.body.lastUser.id).toBe(2);
    });
});
