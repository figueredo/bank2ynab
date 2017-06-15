import { Statement, StatementType } from '../statement';

function mapDate(dayStr, monthStr, year) {
  return new Date(year, parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
}

function mapAmount(amountStr) {
  return parseFloat(amountStr.replace(',', '.'));
}

function mapType(payee) {
  return payee === 'Disponibilização de Benefício' ? StatementType.INFLOW : StatementType.OUTFLOW;
}

export default function mapFactory(year) {
  return function map(entry) {
    const regex = /^(\d{2})\/(\d{2})\s+(.+)\s+R\$\s*(\d+,\d{2})$/i;
    const match = entry.match(regex);
    if (!match) {
      return entry;
    }
    const date = mapDate(match[1], match[2], year);
    const payee = match[3];
    const amount = mapAmount(match[4]);
    const type = mapType(payee);
    return new Statement(date, payee, amount, type);
  };
}
