import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useState } from "react";

const fetchCustomers = async () => {
  return await fetch("http://3.223.4.249/customers/").then(
    (res) => res.json() as Promise<{ name: string }[] | undefined>
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
  } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });

  return { customers, isLoading, error };
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
