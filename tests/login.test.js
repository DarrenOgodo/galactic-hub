// mocking firebase auth and admin to avoid making actual network calls during testing
jest.mock("firebase-admin");
jest.mock("firebase/auth");
jest.mock("firebase/compat/firestore");

const request = require("supertest");
const app = require("../server");
const { signInWithEmailAndPassword } = require("firebase/auth");


describe("POST /login", () => {
    test("loginValidUserAndSetAuthToken", async() => {
        const response = await request(app)
        .post('/login')
        .send({ 
            email: "valid@example.com", 
            password: "validPassword" 
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user', "testUserId");
        expect(response.body).toHaveProperty('message', "Login successful!");
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), "valid@example.com", "validPassword");
    });

    test("invalidLoginAttemptReturnError", async() => {
        const response = await request(app)
        .post('/login')
        .send({
            email: 'invalid@example.com',
            password: 'invalidPassword'
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', "Firebase Error (auth/Invalid login credentials)");
    })
})