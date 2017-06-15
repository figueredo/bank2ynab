import { Observable } from 'rxjs/Observable';

function fromReadStream(stream) {
  return Observable.create((observer) => {
    stream.on('error', err => observer.error(err));
    stream.on('end', () => observer.complete());
    stream.on('data', chunk => observer.next(chunk));
  });
}

Observable.fromReadStream = fromReadStream;
