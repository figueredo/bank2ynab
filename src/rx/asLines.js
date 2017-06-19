import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/concatMap';


function asLines() {
  return Observable.create((observer) => {
    const source = this;

    let buffer = '';

    const subscription = source.subscribe(
      (value) => {
        const lines = buffer.concat(value).split('\n');
        buffer = lines.pop();
        lines.forEach(line => observer.next(line));
      },
      err => observer.error(err),
      () => {
        if (buffer !== '') {
          observer.next(buffer);
        }
        observer.complete();
      },
    );

    return subscription;
  });
}

Observable.prototype.asLines = asLines;
