export interface DashboardData {
  gold: {
    buy: number;
    sell: number;
    buyUSD: number;
    sellUSD: number;
    changeBuy: number;
    changeSell: number;
    time: string;
    date: string;
    name: string;
  } | null;

  exchange: {
    base: string;
    target: string;
    rate: number;
  } | null;

  loanSummary: {
    amount: number;
    remaining: number;
  };

  emiSummary: {
    monthlyPayment: number;
  };

  expenseSummary: {
    totalExpense: number;
  };

  discountSummary: {
    lastSaved: number;
  };

  loading: boolean;

  error: string | null;
}