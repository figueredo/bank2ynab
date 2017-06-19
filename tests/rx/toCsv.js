import { test } from 'tape';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import '../../src/rx/toCsv';

test('is included in Observable', (t) => {
  const observable = Observable.create({});
  t.ok(observable.toCsv);
  t.end();
});

test('emits CSV header when source is empty', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2'];
  const headerNames = ['Property 1', 'Property 2'];
  const expectedHeader = '"Property 1","Property 2"\n';

  Observable
    .empty()
    .toCsv(propertyNames, headerNames)
    .subscribe(header => t.equal(header, expectedHeader));
});

test('emits CSV header when source isn\'t empty', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2'];
  const headerNames = ['Property 1', 'Property 2'];
  const values = [{ prop1: 'value1', prop2: 'value2' }];

  const expectedHeader = '"Property 1","Property 2"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .take(1)
    .subscribe(header => t.equal(header, expectedHeader));
});

test('emits CSV entry containing property values', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2'];
  const headerNames = ['Property 1', 'Property 2'];
  const values = [{ prop1: 'value1', prop2: 'value2' }];

  const expectedEntry = '"value1","value2"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});

test('ignores unspecified properties', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2'];
  const headerNames = ['Property 1', 'Property 2'];
  const values = [{ prop1: 'value1', prop2: 'value2', prop3: 'unspecified' }];

  const expectedEntry = '"value1","value2"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});

test('adds empty column when property doesn\'t exist', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2', 'prop3'];
  const headerNames = ['Property 1', 'Property 2', 'Property 3'];
  const values = [{ prop1: 'value1', prop3: 'value3' }];

  const expectedEntry = '"value1",,"value3"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});

test('escapes double quotes', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2', 'prop3'];
  const headerNames = ['Property 1', 'Property 2', 'Property 3'];
  const values = [{ prop1: 'value1', prop2: '"value2"', prop3: 'value3' }];

  const expectedEntry = '"value1","""value2""","value3"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});

test('don\'t add quotes when value is an integer', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2', 'prop3'];
  const headerNames = ['Property 1', 'Property 2', 'Property 3'];
  const values = [{ prop1: 'value1', prop2: 10, prop3: 'value3' }];

  const expectedEntry = '"value1",10,"value3"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});

test('don\'t add quotes when value is a double', (t) => {
  t.plan(1);

  const propertyNames = ['prop1', 'prop2', 'prop3'];
  const headerNames = ['Property 1', 'Property 2', 'Property 3'];
  const values = [{ prop1: 'value1', prop2: 10.57, prop3: 'value3' }];

  const expectedEntry = '"value1",10.57,"value3"\n';
  Observable
    .from(values)
    .toCsv(propertyNames, headerNames)
    .skip(1)
    .subscribe(entry => t.equal(entry, expectedEntry));
});
