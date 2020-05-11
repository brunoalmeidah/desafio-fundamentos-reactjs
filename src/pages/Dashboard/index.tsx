import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: {
    id: string;
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: { title: string };
    created_at: string;
    category_id: string;
  }[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Response>('transactions');
      const {
        transactions: transactionsResp,
        balance: balanceResp,
      } = response.data;
      // console.log(transactionsResp);
      const transactionsFormatted = transactionsResp.map(item => {
        return {
          id: item.id,
          title: item.title,
          value: item.value,
          formattedValue: formatValue(item.value),
          formattedDate: format(parseISO(item.created_at), 'dd/MM/yyyy'),
          type: item.type,
          category: {
            title: item.category.title,
          },
          created_at: parseISO(item.created_at),
        };
      });
      console.log(transactionsFormatted);
      setTransactions(transactionsFormatted);

      setBalance({
        income: formatValue(balanceResp.income),
        outcome: formatValue(balanceResp.outcome),
        total: formatValue(balanceResp.total),
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(item => (
                <tr key={item.id}>
                  <td className="title">{item.title}</td>
                  <td className={item.type}>
                    {`${item.type === 'outcome' ? '-' : ''}  ${
                      item.formattedValue
                    }`}
                  </td>
                  <td>{item.category.title}</td>
                  <td>{item.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
