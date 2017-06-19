import { test } from 'tape';
import { Statement, StatementType } from '../../src/statement';
import { YnabStatement, mapFactory } from '../../src/output/ynab';

test('maps an inflow statement', (t) => {
  const statement = new Statement(new Date(2017, 5, 1), 'The Worthy Carriage Nano Store', 10.5, StatementType.INFLOW);
  const expectedOutput = new YnabStatement('1/6/2017', 'The Worthy Carriage Nano Store', 0, 10.5);
  const output = mapFactory()(statement);
  t.deepEqual(output, expectedOutput);
  t.end();
});

test('maps an outflow statement', (t) => {
  const statement = new Statement(new Date(2017, 5, 2), 'The Expert Phone Garden Center', 20.75, StatementType.OUTFLOW);
  const expectedOutput = new YnabStatement('2/6/2017', 'The Expert Phone Garden Center', 20.75, 0);
  const output = mapFactory()(statement);
  t.deepEqual(output, expectedOutput);
  t.end();
});
