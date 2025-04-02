const jest = require("jest-mock");
module.exports = {
  createAuthClient: jest.fn(() => ({
    useSession: jest.fn(() => ({ data: null })),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
};
