const config = {
  coverageDirectory: '../../coverage/libs/backend-grpc',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 20,
      functions: 23,
      lines: 55,
      statements: 52,
    },
  },
  displayName: 'backend-grpc',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  preset: '../../jest.preset.js',
  resolver: '../../tools/js/jest-node-resolver.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
};

export default config;
