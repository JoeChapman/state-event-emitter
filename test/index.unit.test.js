import StateEventEmitter from '../src';

describe('StateEventEmitter', () => {

  describe('on', () => {
    let emitter;
    let listener;
    beforeEach(() => {
      emitter = new StateEventEmitter();
      listener = jest.fn();
    });
    test('registers an event with a listener', () => {
      emitter.on('a', listener);
      emitter.emit('a');
      expect(listener).toHaveBeenCalledTimes(1);
    });
    test('registers a listener for all (*) events when no event argument', () => {
      emitter.on(listener);
      emitter.emit('*');
      expect(listener).toHaveBeenCalledTimes(1);
    });
    test('supports namespaces', () => {
      emitter.on('a.b.c', listener);
      emitter.emit('a');
      emitter.emit('a.b');
      emitter.emit('a.b.c');
      expect(listener).toHaveBeenCalledTimes(3);
    });
  });

  describe('off', () => {
    let emitter;
    let listener;
    beforeEach(() => {
      emitter = new StateEventEmitter();
      listener = jest.fn();
    });
    test('must be called with an event argument', () => {
      expect(() => {
        emitter.off();
      }).toThrow('off must be called with an event as the first argument');
    });
    test('event argument must be a string', () => {
      expect(() => {
        emitter.off(listener);
      }).toThrow('off must be called with an event as the first argument');
    });
    test('unregisters all listeners from an event', () => {
      emitter.on('a', listener);
      emitter.emit('a');
      expect(listener).toHaveBeenCalledTimes(1);
      emitter.off('a');
      emitter.emit('a');
      expect(listener).toHaveBeenCalledTimes(1);
    });
    test('can unregister a listener from an event', () => {
      let listener2 = jest.fn();
      emitter.on('a', listener);
      emitter.on('a', listener2);
      emitter.emit('a');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      emitter.off('a', listener);
      emitter.emit('a');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });
  });

  describe('emit', () => {
    let emitter;
    let listener1;
    let listener2;
    beforeEach(() => {
      emitter = new StateEventEmitter();
      listener1 = jest.fn();
      listener2 = jest.fn();
    });
    test('executes all listeners registered to an event', () => {
      emitter.on('a', listener1);
      emitter.on('a', listener2);
      emitter.emit('a');
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
    test('passes the state to the listener', () => {
      const data = {foo: 'bar'};
      emitter.on('a', listener1);
      emitter.on('a', listener2);
      emitter.emit('a', data);
      expect(listener1).toHaveBeenCalledWith(data);
      expect(listener2).toHaveBeenCalledWith(data);
    });
    test('the state passed to the listener can be subset', () => {
      const data = {foo: 'bar'};
      const expected = {bar: 'foo', baz: 'whats'};
      emitter.load({foo: 'baz', bar: 'foo', baz: 'whats'});
      emitter.on('a', listener1);
      emitter.emit('a:bar:baz', data);
      expect(listener1).toHaveBeenCalledWith(expected);
    });
    test('executes a listener as a method of the context argument', () => {
      const context = new (jest.fn())();
      emitter.on('a', listener1);
      emitter.on('a', listener2);
      emitter.emit('a', {}, context);
      expect(listener1).calledOn(context);
      expect(listener2).calledOn(context);
    });
    test('executes a listener as a method of the emitter by default', () => {
      emitter.on('a', listener1);
      emitter.emit('a', {}, emitter);
      expect(listener1).calledOn(emitter);
    });
  });

  describe('load', () => {
    let emitter;
    let listener;
    beforeEach(() => {
      emitter = new StateEventEmitter();
      listener = jest.fn();
    });
    test('merges loaded nested data with the state', () => {
      const data = {a: 0, b: 1, c: {d: 4}};
      const updated = {a: 0, b: {c: [1, {d: 5}]}};
      const expected = {a: 0, b: {c: [1, {d: 5}]}, c: {d: 4}};
      emitter.load(data);
      emitter.on('a', listener);
      emitter.emit('a', updated);
      expect(listener).toHaveBeenCalledWith(expected);
    });
  });
});
