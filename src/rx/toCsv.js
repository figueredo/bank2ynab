import { Observable } from 'rxjs/Observable';

function escape(value) {
  return typeof value === 'string' ? value.replace(/"/g, '""') : value;
}

function wrap(value) {
  return typeof value === 'string' ? `"${value}"` : value;
}

function appendNewLine(line) {
  return `${line}\n`;
}

function toCsvRow(columns) {
  const row = columns
    .map(column => wrap(escape(column)))
    .join();
  return appendNewLine(row);
}

function toColumns(object, propertyNames) {
  return propertyNames
    .map(propertyName => object[propertyName]);
}

function toCsv(propertyNames, headerNames) {
  return Observable.create((observer) => {
    const source = this;

    const headerRow = toCsvRow(headerNames);
    observer.next(headerRow);

    const subscription = source.subscribe(
      value => observer.next(toCsvRow(toColumns(value, propertyNames))),
      err => observer.error(err),
      () => observer.complete(),
    );

    return subscription;
  });
}

Observable.prototype.toCsv = toCsv;
