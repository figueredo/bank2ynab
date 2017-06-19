import { createReadStream, createWriteStream } from 'fs';
import { Observable } from 'rxjs/Observable';

import './rx/fromReadStream';
import './rx/toWriteStream';

export function readFile(file) {
  const stream = createReadStream(file);
  return Observable.fromReadStream(stream);
}

export function writeFile(file, data) {
  const stream = createWriteStream(file);
  return data.toWriteStream(stream);
}

export function writeStderr(data) {
  return data.toWriteStream(process.stderr);
}
