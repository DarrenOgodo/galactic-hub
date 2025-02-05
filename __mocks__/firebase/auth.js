module.exports = {
    getAuth: jest.fn(() => ({
        currentUser: { uid: "testUserId", getIdToken: jest.fn(() => Promise.resolve("mocked-auth-token")) }
    })),
    signInWithEmailAndPassword: jest.fn(async (auth, email, password) => {
        if(email == "valid@example.com" && password == "validPassword"){
            return {
                user: { uid: "testUserId", getIdToken: jest.fn(() => Promise.resolve("mocked-auth-token")) }
            }
        }else{
            throw new Error("Firebase Error (auth/Invalid login credentials)");
        }
    })
}