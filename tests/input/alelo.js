import { test } from 'tape';
import { Statement, StatementType } from '../../src/statement';
import mapFactory from '../../src/input/alelo';

test('returns the entry if not recognized', (t) => {
  const entry = 'Non-recognizable entry';
  const expectedOutput = 'Non-recognizable entry';
  const output = mapFactory(2017)(entry);
  t.deepEqual(output, expectedOutput);
  t.end();
});

test('uses defined year when parsing statement date', (t) => {
  const entry = '04/06	Disponibilização de Benefício	R$ 42,68'; // eslint-disable-line no-tabs
  const expectedOutput = new Statement(new Date(2018, 5, 4), 'Disponibilização de Benefício', 42.68, StatementType.INFLOW);
  const output = mapFactory(2018)(entry);
  t.deepEqual(output, expectedOutput);
  t.end();
});

test('maps to an inflow statement', (t) => {
  const entry = '04/06	Disponibilização de Benefício	R$ 42,68'; // eslint-disable-line no-tabs
  const expectedOutput = new Statement(new Date(2017, 5, 4), 'Disponibilização de Benefício', 42.68, StatementType.INFLOW);
  const output = mapFactory(2017)(entry);
  t.deepEqual(output, expectedOutput);
  t.end();
});

test('maps to an outflow statement', (t) => {
  const entry = '04/06	THE WORTHY CARRIAGE NANO STORE	R$ 42,68'; // eslint-disable-line no-tabs
  const expectedOutput = new Statement(new Date(2017, 5, 4), 'THE WORTHY CARRIAGE NANO STORE', 42.68, StatementType.OUTFLOW);
  const output = mapFactory(2017)(entry);
  t.deepEqual(output, expectedOutput);
  t.end();
});
