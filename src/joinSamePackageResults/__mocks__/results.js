const resultsMock = [
  {
    name: '/foo/node_modules/package-name/index.js',
    totalTime: 1,
    data: [
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
  {
    name: '/foo/node_modules/package-name/src/nested.js',
    totalTime: 1,
    data: [
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
  {
    name: './relative.js',
    totalTime: 1,
    data: [
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

module.exports = resultsMock;
