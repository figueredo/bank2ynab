import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import parseArgs from './args';
import { readFile, writeFile } from './io';
import aleloFactory from './input/alelo';
import nubankFactory from './input/nubank';
import { CsvPropertyNames, CsvHeaderNames, mapFactory as ynabFactory } from './output/ynab';
import './rx/asLines';
import './rx/toCsv';

function createInputMapper(type, options) {
  let mapper;
  switch (type) {
    case 'alelo':
      mapper = aleloFactory(options.year);
      break;
    case 'nubank':
      mapper = nubankFactory(options.year);
      break;
    default:
      mapper = null; // won't happen
      break;
  }
  return mapper;
}

function createSource(inputFile) {
  return readFile(inputFile);
}

function connectInputFilter(source, type, options) {
  const inputMapper = createInputMapper(type, options);
  return source
    .asLines()
    .map(inputMapper);
}

function connectOutputFilter(source) {
  return source
    .map(ynabFactory())
    .toCsv(CsvPropertyNames, CsvHeaderNames);
}

function connectSink(source, outputFile) {
  return writeFile(outputFile, source);
}

function createPipeline(inputOpts, outputOpts) {
  const source = createSource(inputOpts.file);
  const inputFilter = connectInputFilter(source, inputOpts.type, inputOpts.opts);
  const outputFilter = connectOutputFilter(inputFilter);
  return connectSink(outputFilter, outputOpts.file);
}

function executePipeline(pipeline) {
  return pipeline.toPromise();
}

const args = parseArgs();
const inputOpts = {
  file: args._[0],
  type: args.type,
  opts: {
    year: args.year,
  },
};
const outputOpts = {
  file: args._[1],
};

const pipeline = createPipeline(inputOpts, outputOpts);
executePipeline(pipeline)
  .then(
    () => console.log(`Finished converting ${inputOpts.file} to ${outputOpts.file}`),
    err => console.error(err));
