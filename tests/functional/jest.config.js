module.exports = {
  displayName: 'Functional Tests',
  testEnvironment: 'jsdom',
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/functional/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/tests/functional/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
      }
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/react-app-env.d.ts',
  ],
  coverageDirectory: '<rootDir>/tests/functional/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
