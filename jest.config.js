import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "!lib/**/*.d.ts",
    "!lib/**/__tests__/**",
  ],
  ㄴ,
};

export default createJestConfig(customJestConfig);
