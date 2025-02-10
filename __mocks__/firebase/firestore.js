// mocking firestore methods 
module.exports = {
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    doc: jest.fn(() => ({})),
    setDoc: jest.fn(() => Promise.resolve("mock-user-added-successfully"))
}