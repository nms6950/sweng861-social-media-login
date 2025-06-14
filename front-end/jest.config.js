module.exports = {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    },
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!(axios)/)'  // 👈 transform axios
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',      // ✅ only source files
        '!src/main.js',           // ❌ skip entry point if needed
        '!**/node_modules/**',    // ✅ skip node_modules
        '!**/vendor/**'           // ✅ skip vendor
    ],
  };
  