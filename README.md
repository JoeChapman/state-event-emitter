# state-event-emitter

[![Greenkeeper badge](https://badges.greenkeeper.io/JoeChapman/state-event-emitter.svg)](https://greenkeeper.io/)

ES6 event emitter to communicate state between application components

## Use case
When each component of an application needs a portion of the application state and the components should be decoupled, this module provides a means to share the state of the application between its components in a pub/sub fashion.

## API
`on` - register an event and listener or just a listener that is registered to `*`.
Supports namespaces i.e.
```js
  emitter.on('a.b.c', listener);

  // listener will execute for each of the following
  emitter.emit('a');
  emitter.emit('a.b');
  emitter.emit('a.b.c');
```

`off` - unregister all listeners of an event or just a single listener of an event

`load` - load the application state in the emitter

`emit` - trigger the listener of an event with the state or subset the state, i.e.
```js
  emitter.on('my-event', listener);
  emitter.emit('my-event:b', {a, 1, b: {c: 2}});

  // listener will be executed with {b: {c: 2}}
```

## Scripts
```bash
$ npm t
```

```bash
$ npm run lint
```

Contributions and comments welcome.
