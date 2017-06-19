import yargs from 'yargs';

export default function parseArgs() {
  return yargs
  .option('type', {
    alias: 't',
    describe: 'choose the input file type',
    choices: ['alelo'],
    demandOption: true,
  })
  .option('year', {
    alias: 'y',
    describe: 'year to use when missing in statement',
    default: new Date().getFullYear(),
    defaultDescription: 'current year',
    type: 'number',
  })
  .command('* <input> <output>', 'converts input into output file')
  .demandCommand(2)
  .alias('h', 'help')
  .help('help')
  .argv;
}
