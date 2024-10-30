import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useState } from "react";

export type Transaction = {
  id: string;
  customerId: string;
  description: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

const fetchTransactions = async () => {
  return await fetch("http://3.223.4.249/transactions/").then(
    (res) => res.json() as Promise<Transaction[] | undefined>
  );
};

const TransactionsContext = createContext<
  ReturnType<typeof useTransactionsContext>
>(null as any);

function useTransactionsContext() {
  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    refetchInterval: 10000, // Polling every 10 seconds
  });

  const updateTransactionStatus = useCallback(
    async (id: string, action: "block" | "available" | "pending") => {
      try {
        const response = await fetch(`http://3.223.4.249/transactions/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: id,
            status: action,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to ${action} transaction`);
        }

        await refetch();
      } catch (error) {
        console.error(`Error ${action}ing transaction:`, error);
      }
    },
    [refetch]
  );

  const blockTransaction = useCallback(
    (id: string) => updateTransactionStatus(id, "block"),
    [updateTransactionStatus]
  );

  const antecipateTransaction = useCallback(
    (id: string) => updateTransactionStatus(id, "available"),
    [updateTransactionStatus]
  );

  const resetTransaction = useCallback(
    (id: string) => updateTransactionStatus(id, "pending"),
    [updateTransactionStatus]
  );

  return {
    transactions,
    isLoading,
    error,
    blockTransaction,
    antecipateTransaction,
    resetTransaction,
  };
}

const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
  const transactions = useTransactionsContext();

  return (
    <TransactionsContext.Provider value={transactions}>
      {children}
    </TransactionsContext.Provider>
  );
};

const useTransactions = () => {
  const transactions = React.useContext(TransactionsContext);

  if (!transactions) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }

  return transactions;
};

export {
  TransactionsContext,
  useTransactionsContext,
  TransactionsProvider,
  useTransactions,
};
