import { Statement, StatementType } from '../statement';

const MONTHS_ABREV_PT_BR = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

function mapMonth(monthStr) {
  return MONTHS_ABREV_PT_BR.indexOf(monthStr);
}

function mapDate(dayStr, monthStr, year) {
  const month = mapMonth(monthStr);
  if (month === -1) {
    return null;
  }
  return new Date(year, month, parseInt(dayStr, 10));
}

function mapAmount(amountStr) {
  return Math.abs(parseFloat(amountStr.replace(',', '.')));
}

function mapType(amountStr) {
  return amountStr.startsWith('-') ? StatementType.INFLOW : StatementType.OUTFLOW;
}

export default function mapFactory(year) {
  return function map(entry) {
    const regex = /^(\d{2})\s+([A-Z]{3})\s+(.+)\s+(-?\d+,\d{2})$/i;
    const match = entry.match(regex);
    if (!match) {
      return entry;
    }
    const date = mapDate(match[1], match[2], year);
    if (!date) {
      return entry;
    }
    const payee = match[3];
    const amount = mapAmount(match[4]);
    const type = mapType(match[4]);
    return new Statement(date, payee, amount, type);
  };
}
