import { pathsToModuleNameMapper } from 'ts-jest';

module.exports = {
    preset: 'ts-jest',
    maxWorkers: '25%',
    testEnvironment: 'node',
    collectCoverage: false,
    testTimeout: 20000,
    moduleFileExtensions: ['ts', 'js'],
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['.'],
    modulePathIgnorePatterns: ['<rootDir>/test/e2e', '<rootDir>/config'],
};
