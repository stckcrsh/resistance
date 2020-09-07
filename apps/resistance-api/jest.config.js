module.exports = {
  name: 'resistance-api',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    }
  },
  coverageDirectory: '../../coverage/apps/resistance-api'
};