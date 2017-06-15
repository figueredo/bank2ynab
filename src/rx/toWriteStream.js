import { Observable } from 'rxjs/Observable';

function toWriteStream(stream) {
  return Observable.create((observer) => {
    const source = this;
    let emittedError = false;
    let emittedComplete = false;

    function emitError(err) {
      if (!emittedError && !emittedComplete) {
        emittedError = true;
        observer.error(err);
      }
    }

    function emitComplete() {
      if (!emittedComplete && !emittedError) {
        emittedComplete = true;
        observer.complete();
      }
    }

    stream.on('error', (err) => {
      emitError(err);
      stream.end();
    });
    stream.on('finish', () => emitComplete());

    const subscription = source.subscribe(
      chunk => stream.write(chunk),
      (err) => {
        emitError(err);
        stream.end();
      },
      () => stream.end(),
    );

    return subscription;
  });
}

Observable.prototype.toWriteStream = toWriteStream;
