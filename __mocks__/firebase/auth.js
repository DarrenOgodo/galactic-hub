module.exports = {
    getAuth: jest.fn(() => ({
        currentUser: { 
            uid: "testUserId", 
            getIdToken: jest.fn(() => Promise.resolve("mocked-auth-token")) 
        },
        createUser: {
            uid: "newUserId",
            getIdToken: jest.fn(() => Promise.resolve("mocked-new-user-auth-token"))
        }
    })),
    signInWithEmailAndPassword: jest.fn(async (auth, email, password) => {
        if(email == "valid@example.com" && password == "validPassword"){
            return {
                user: { 
                    uid: "testUserId", 
                    getIdToken: jest.fn(() => Promise.resolve("mocked-auth-token")) 
                }
            }
        }else{
            throw new Error("Firebase Error (auth/Invalid login credentials)");
        }
    }),
    createUserWithEmailAndPassword: jest.fn(async(auth, email, password) => {

        if(email && password){
            return{
                user: {
                    uid: "newUserId",
                    getIdToken: jest.fn(() => Promise.resolve("mocked-new-user-auth-token"))
                }
            }
        }else{
            throw new Error("Incomplete user details");
        }
    })
}