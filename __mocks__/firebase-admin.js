module.exports = {
    auth: jest.fn(() => ({
        verifyIdToken: jest.fn(() => Promise.resolve({ uid: "testUserId" }))
    })),
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn()
    },
    // firestore: jest.fn(() => ({
    //     collection: jest.fn(() => ({
    //         doc: jest.fn(() => ({
    //             set: jest.fn(() => Promise.resolve())
    //         }))
    //     }))
    // }))
};  