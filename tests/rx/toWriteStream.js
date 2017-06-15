import { test } from 'tape';
import { Writable } from 'stream';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import '../../src/rx/toWriteStream';

const emptySubscriber = {
  next() {},
  error() {},
  complete() {},
};

test('is included in Observable', (t) => {
  const observable = Observable.create({});
  t.ok(observable.toWriteStream);
  t.end();
});

test('writes to the stream the values emitted by the source', (t) => {
  t.plan(1);

  const value = ['value'];
  const stream = new Writable({
    write(chunk, encoding, callback) {
      t.pass('should write a value');
      callback();
    },
  });

  Observable
    .from(value)
    .toWriteStream(stream)
    .subscribe(emptySubscriber);
});

test('writes to the stream as many times as values emitted by the source', (t) => {
  t.plan(3);

  const values = ['value1', 'value2', 'value3'];
  const stream = new Writable({
    write(chunk, encoding, callback) {
      t.pass('should write a value');
      callback();
    },
  });

  Observable
    .from(values)
    .toWriteStream(stream)
    .subscribe(emptySubscriber);
});

test('writes to the stream the values emitted by the source', (t) => {
  t.plan(3);

  const values = ['value1', 'value2', 'value3'];
  let i = 0;
  const stream = new Writable({
    write(chunk, encoding, callback) {
      t.equal(chunk.toString(), values[i]);
      i += 1;
      callback();
    },
  });

  Observable
    .from(values)
    .toWriteStream(stream)
    .subscribe(emptySubscriber);
});

test('closes the stream when the source completes', (t) => {
  t.plan(1);

  const stream = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });
  stream.end = () => t.pass('should close the stream');

  Observable
    .empty()
    .toWriteStream(stream)
    .subscribe(emptySubscriber);
});

test('completes when the source completes', (t) => {
  t.plan(1);

  const stream = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });

  Observable
    .empty()
    .toWriteStream(stream)
    .subscribe(
      () => {},
      () => {},
      () => t.pass('should complete'));
});

test('closes the stream when the source emits an error', (t) => {
  t.plan(1);

  const stream = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });
  stream.end = () => t.pass('should close the stream');

  Observable
    .throw(new Error('error'))
    .toWriteStream(stream)
    .subscribe(emptySubscriber);
});

test('emits an error when the source emits an error', (t) => {
  t.plan(1);

  const stream = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });

  Observable
    .throw(new Error('error'))
    .toWriteStream(stream)
    .subscribe(
      () => {},
      () => t.pass('should emit an error'));
});
