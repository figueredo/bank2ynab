import { test } from 'tape';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toArray';

import '../../src/rx/asLines';

test('is included in Observable', (t) => {
  const observable = Observable.create({});
  t.ok(observable.asLines);
  t.end();
});

test('emits an error when the source emits an error', (t) => {
  t.plan(1);

  Observable
    .throw()
    .asLines()
    .subscribe(
      () => {},
      () => t.pass('should emit an error'));
});

test('completes the source completes', (t) => {
  t.plan(1);

  Observable
    .empty()
    .asLines()
    .subscribe(
      () => {},
      () => {},
      () => t.pass('should complete'));
});

test('breaks string into lines', (t) => {
  t.plan(1);

  const expectedLines = ['First line', 'Second line'];

  Observable
    .of('First line\nSecond line\n')
    .asLines()
    .toArray()
    .subscribe(lines => t.deepEqual(lines, expectedLines));
});

test('breaks string into lines from multiple emissions', (t) => {
  t.plan(1);

  const expectedLines = ['First line', 'Second line', 'Third line'];

  Observable
    .of('First line\n', 'Second line\n', 'Third line\n')
    .asLines()
    .toArray()
    .subscribe(lines => t.deepEqual(lines, expectedLines));
});

test('emits last line when doesn\'t have a line break', (t) => {
  t.plan(1);

  const expectedLines = ['First line', 'Second line'];

  Observable
    .of('First line\nSecond line')
    .asLines()
    .toArray()
    .subscribe(lines => t.deepEqual(lines, expectedLines));
});

test('emits empty lines', (t) => {
  t.plan(1);

  Observable
    .of('\n\n\n')
    .asLines()
    .count()
    .subscribe(count => t.equal(count, 3));
});
