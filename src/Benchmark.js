const hop = (o, key) => Object.hasOwnProperty.call(o, key);

class Benchmark {
  constructor({
    now = () => process.hrtime(),
    diff = start => {
      const delta = process.hrtime(start);
      return delta[0] * 1e3 + delta[1] / 1e6;
    },
  } = {}) {
    this.events = {};
    this.visits = {};
    this.results = {};
    this.now = now;
    this.diff = diff;
  }
  push(name) {
    if (!hop(this.events, name)) {
      this.events[name] = [];
      this.visits[name] = 0;
    }
    this.events[name].push(this.now());
    this.visits[name]++;
  }
  pop(name) {
    if (hop(this.events, name) && this.events[name].length > 0) {
      const start = this.events[name].shift();
      const delta = this.diff(start);

      if (!hop(this.results, name)) {
        this.results[name] = {
          aggregate: 0,
          values: [],
        };
      }

      this.results[name].aggregate += delta;
      this.results[name].values.push(delta);
    }
  }
}

module.exports = Benchmark;
