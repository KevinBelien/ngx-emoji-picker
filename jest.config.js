module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    // globals: {
    //   'ts-jest': {
    //     stringifyContentPathRegex: '\\.(html|svg)$',

    //     tsconfig: '<rootDir>/tsconfig.spec.json',
    //   },
    // },
    moduleNameMapper: {
        '^@chit-chat/ngx-emoji-picker/src/lib/(.*)$': '<rootDir>/projects/emoji-picker-lib/src/lib/$1'
    },
    testEnvironment: 'jsdom'
};
