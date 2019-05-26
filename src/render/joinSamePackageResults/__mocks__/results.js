const resultsMock = [
  {
    name: '/foo/node_modules/package-name/index.js',
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
  {
    name: '/foo/node_modules/package-name/src/nested.js',
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

module.exports = resultsMock;
