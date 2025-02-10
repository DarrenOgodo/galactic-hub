// mocking firebase auth and admin to avoid making actual network calls during testing
jest.mock("firebase-admin");
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

const request = require("supertest");
const app = require("../server");
const { createUserWithEmailAndPassword } = require("firebase/auth");

describe("POST /register", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("createAccountSuccessfully", async() => {
        
        const newUser = {
            fname: "John",
            lname: "Doe",
            dob: "01-01-2000",
            email: "test@example.com",
            password: "password"
        }

        const response = await request(app)
        .post('/register')
        .send(newUser);

        expect(response.status).toBe(200);
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), newUser.email, newUser.password);
        
    })

    test("createAccountWithIncompleteDetailsReturnsError", async() => {
        
        const newUser = {
            fname: "John",
            lname: "Doe",
            dob: "01-01-2000",
            email: "test@example.com"
        }

        const response = await request(app)
        .post('/register')
        .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', "Incomplete user details");
    })
})