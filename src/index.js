export default class StateEventEmitter {
  constructor() {
    this.events = {};
    this.state = {};
  }
  load(state) {
    Object.assign(this.state, state);
  }
  on(ev, cb) {
    if (typeof ev === 'function') {
      cb = ev;
      ev = '*';
    }
    const events = ev.split('.');
    let ns = '';
    events.forEach((e) => {
      ns = ns + (events.indexOf(e) !== 0 ? '.' : '') + e;
      if (!this.events[ns]) {
        this.events[ns] = [];
      }
      this.events[ns].push(cb);
    });
  }
  off(ev, cb) {
    if (!ev || typeof ev !== 'string') {
      throw Error('off must be called with an event as the first argument');
    }
    if (cb) {
      const pos = this.events[ev].indexOf(cb);
      return this.events[ev].splice(pos, 1);
    }
    delete this.events[ev];
  }
  emit(ev, state, ctx) {
    let names;
    [ev, ...names] = ev.split(':');

    if (this.events[ev] && this.events[ev].length) {
      this.events[ev].forEach(cb => {
        let subState = Object.keys(this.state).reduce((a, i) => {
          if (names.includes(i)) {
            a[i] = this.state[i];
          }
          return a;
        }, {});
        subState = Object.keys(subState).length ? subState : state;
        cb.call(ctx, subState);
      });
    }
  }
};
