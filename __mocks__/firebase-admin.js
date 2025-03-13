module.exports = {
    auth: jest.fn(() => ({
        verifyIdToken: jest.fn(() => Promise.resolve({ uid: "testUserId" }))
    })),
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn()
    },
};