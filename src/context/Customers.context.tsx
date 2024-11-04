import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useState } from "react";

export type Customer = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status?: "terminated";
};

const fetchCustomers = async () => {
  return await fetch("http://3.223.4.249/customers/").then(
    (res) => res.json() as Promise<Customer[]>
  );
};

const CustomersContext = createContext<ReturnType<typeof useCustomersContext>>(
  null as any
);

function useCustomersContext() {
  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });

  return { customers, isLoading, error, refetch };
}

const CustomersProvider = ({ children }: { children: React.ReactNode }) => {
  const customers = useCustomersContext();

  return (
    <CustomersContext.Provider value={customers}>
      {children}
    </CustomersContext.Provider>
  );
};

const useCustomers = () => {
  const customers = React.useContext(CustomersContext);

  if (!customers) {
    throw new Error("useCustomers must be used within a CustomersProvider");
  }

  return customers;
};

export {
  CustomersContext,
  useCustomersContext,
  CustomersProvider,
  useCustomers,
};
