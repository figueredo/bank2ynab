import { test } from 'tape';
import { Readable } from 'stream';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/count';
import '../../src/rx/fromReadStream';

test('is included in Observable', (t) => {
  t.ok(Observable.fromReadStream);
  t.end();
});

test('emits an error when the stream emits an error', (t) => {
  t.plan(1);

  const stream = new Readable({
    read() {
      this.emit('error');
    },
  });

  Observable
    .fromReadStream(stream)
    .subscribe(
      () => {},
      () => t.pass('should emit an error'));
});

test('completes when the stream ends', (t) => {
  t.plan(1);

  const stream = new Readable({
    read() {
      this.push(null);
    },
  });

  Observable
    .fromReadStream(stream)
    .subscribe(
      () => {},
      () => {},
      () => t.pass('should complete'));
});

test('emits a value when the stream emits a value', (t) => {
  t.plan(1);

  let i = 0;
  const stream = new Readable({
    read() {
      if (i === 0) {
        this.push('value');
      } else {
        this.push(null);
      }
      i += 1;
    },
  });

  Observable
    .fromReadStream(stream)
    .subscribe(() => t.pass('should emit a value'));
});

test('emits as many values as emitted by the stream', (t) => {
  t.plan(1);

  const valueCount = 3;
  let i = 0;
  const stream = new Readable({
    read() {
      if (i < valueCount) {
        this.push('value');
      } else {
        this.push(null);
      }
      i += 1;
    },
  });

  Observable
    .fromReadStream(stream)
    .count()
    .subscribe(count => t.equal(count, valueCount));
});

test('completes when the stream ends after emitting values', (t) => {
  t.plan(1);

  let i = 0;
  const stream = new Readable({
    read() {
      if (i === 0) {
        this.push('value');
      } else {
        this.push(null);
      }
      i += 1;
    },
  });

  Observable
    .fromReadStream(stream)
    .subscribe(
      () => {},
      () => {},
      () => t.pass('should complete'));
});
