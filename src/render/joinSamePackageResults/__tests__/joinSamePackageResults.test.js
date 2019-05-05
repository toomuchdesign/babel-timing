const joinSamePackageResults = require('../index');
const resultsMock = require('../__mocks__/results');

// @TODO: rewrite as integration test
describe('joinSamePackageResults', () => {
  it('join results from same package', () => {
    const actual = joinSamePackageResults(resultsMock);
    const expected = [
      {
        name: '/foo/node_modules/package-name/',
        totalTime: 2,
        plugins: [
          {
            plugin: 'due',
            timePerVisit: 1,
            time: 4,
            visits: 4,
          },
          {
            plugin: 'uno',
            timePerVisit: 1,
            time: 2,
            visits: 2,
          },
        ],
      },
      {
        name: './relative.js',
        totalTime: 1,
        plugins: [
          {
            plugin: 'uno',
            timePerVisit: 1,
            time: 1,
            visits: 1,
          },
          {
            plugin: 'due',
            timePerVisit: 1,
            time: 2,
            visits: 2,
          },
        ],
      },
    ];

    expect(actual).toEqual(expected);
  });
});
