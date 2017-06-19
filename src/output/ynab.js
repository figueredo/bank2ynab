import { StatementType } from '../statement';

function dateToString(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const CsvPropertyNames = ['date', 'payee', 'outflow', 'inflow'];
export const CsvHeaderNames = ['Date', 'Payee', 'Outflow', 'Inflow'];

export class YnabStatement {
  constructor(date, payee, outflow, inflow) {
    this.date = date;
    this.payee = payee;
    this.outflow = outflow;
    this.inflow = inflow;
  }
}

export function mapFactory() {
  return function map(statement) {
    const dateStr = dateToString(statement.date);
    const outflow = statement.type === StatementType.OUTFLOW ? statement.amount : 0;
    const inflow = statement.type === StatementType.INFLOW ? statement.amount : 0;
    return new YnabStatement(dateStr, statement.payee, outflow, inflow);
  };
}
