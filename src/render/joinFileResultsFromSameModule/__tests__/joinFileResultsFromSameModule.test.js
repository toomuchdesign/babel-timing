const joinFileResultsFromSameModule = require('../index.ts').default;
const resultsMock = require('../__mocks__/results');

// @TODO: rewrite as integration test
describe('joinFileResultsFromSameModule', () => {
  it('join results from same package', () => {
    const actual = joinFileResultsFromSameModule(resultsMock);
    const expected = [
      {
        name: '/foo/node_modules/package-name/',
        time: 2,
        plugins: [
          {
            name: 'due',
            timePerVisit: 1,
            time: 4,
            visits: 4,
          },
          {
            name: 'uno',
            timePerVisit: 1,
            time: 2,
            visits: 2,
          },
        ],
      },
      {
        name: './relative.js',
        time: 1,
        plugins: [
          {
            name: 'uno',
            timePerVisit: 1,
            time: 1,
            visits: 1,
          },
          {
            name: 'due',
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
