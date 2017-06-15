export const StatementType = {
  INFLOW: 0,
  OUTFLOW: 1,
};

export class Statement {
  constructor(date, payee, amount, type) {
    this.date = date;
    this.payee = payee;
    this.amount = amount;
    this.type = type;
  }
}
