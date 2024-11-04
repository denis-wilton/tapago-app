import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/Auth.context";
import {
  Customer as CustomerEntity,
  useCustomers,
} from "../../context/Customers.context";
import {
  Transaction as TransactionType,
  useTransactions,
} from "../../context/Transactions.context";
import Transaction from "./components/Transaction";
import SearchBar from "./components/SearchBar/SearchBar";
import { useSwipeable } from "react-swipeable";
import Options from "../../assets/options.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useBattery } from "../../context/Battery.context";

export default function Customer() {
  const { user } = useAuth();
  const { customers } = useCustomers();
  const {
    transactions,
    isLoading: isLoadingTransactions,
    blockTransaction,
    antecipateTransaction,
    resetTransaction,
  } = useTransactions();

  const [currentCustomer, setCurrentCustomer] = useState<CustomerEntity | null>(
    null
  );
  const [showEndContractModal, setShowEndContractModal] = useState(false);

  const { cpf } = useParams<{ cpf: string }>();

  useEffect(() => {
    if (cpf && customers) {
      const foundCustomer = customers.find((customer) => customer.cpf === cpf);
      if (foundCustomer) {
        setCurrentCustomer(foundCustomer);
      } else {
        console.log(`Customer with CPF ${cpf} not found`);
      }
    }
  }, [cpf, customers]);

  const customerTransactions = useMemo(
    () =>
      currentCustomer && transactions
        ? transactions.filter(
            ({ customerId }) => customerId === currentCustomer.id
          )
        : [],
    [transactions, currentCustomer]
  );

  const totalAvailable = useMemo(
    () => calculateTotal(customerTransactions, "available") * 0.97,
    [customerTransactions]
  );

  const grossSold = useMemo(
    () => calculateTotal(customerTransactions, null),
    [customerTransactions]
  );

  const collectedFee = useMemo(() => grossSold * 0.03, [grossSold]);

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
    []
  );

  const formattedTotalAvailable = formatCurrency(totalAvailable);
  const formattedGrossSold = formatCurrency(grossSold);
  const formattedCollectedFee = formatCurrency(collectedFee);

  const onSearch = useCallback(
    (name: string) => {
      if (!customers) {
        console.log("No customers available");
        return;
      }

      const foundCustomer = customers.find(
        (customer) => customer.name === name
      );

      if (foundCustomer) {
        setCurrentCustomer(foundCustomer);
      } else {
        console.log(`Customer with name ${name} not found`);
      }
    },
    [customers]
  );

  const handleEndContractClick = () => {
    setShowEndContractModal(true);
  };

  const handleCloseModal = () => {
    setShowEndContractModal(false);
  };

  return (
    <div className="h-full grid grid-rows-[auto,auto,auto,1fr] overflow-hidden">
      <Header user={user} />
      <div className="flex justify-between pb-7 px-4 gap-4 items-center bg-primary">
        <SearchBar
          suggestions={customers?.map((customer) => customer.name) ?? []}
          onSearch={onSearch}
        />
        <button
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 whitespace-nowrap text-xs"
          onClick={handleEndContractClick}
        >
          encerrar contrato
        </button>
      </div>
      <CustomerSummary
        currentCustomer={currentCustomer}
        formattedTotalAvailable={formattedTotalAvailable}
        formattedGrossSold={formattedGrossSold}
        formattedCollectedFee={formattedCollectedFee}
      />
      <TransactionList
        isLoadingTransactions={isLoadingTransactions}
        customerTransactions={customerTransactions}
        blockTransaction={blockTransaction}
        antecipateTransaction={antecipateTransaction}
        resetTransaction={resetTransaction}
      />
      {showEndContractModal && currentCustomer && (
        <EndContractModal
          customerName={currentCustomer.name}
          customerId={currentCustomer.id}
          customerCpf={currentCustomer.cpf}
          onClose={handleCloseModal}
          pendingTransactions={customerTransactions.filter(
            (transaction) => transaction.status === "pending"
          )}
        />
      )}
    </div>
  );
}

function calculateTotal(
  transactions: TransactionType[],
  status: string | null
) {
  return transactions
    .filter(
      (transaction) =>
        (status ? transaction.status === status : true) &&
        transaction.status !== "block"
    )
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
}

const Header = ({ user }: { user: null | { username: string } }) => {
  const navigate = useNavigate();
  const { batteryStatus } = useBattery();

  return (
    <div className="flex items-center justify-between p-5 pb-5 bg-primary text-primary">
      <h1 className="font-bold leading-none" onClick={() => navigate("/")}>
        tapago
      </h1>
      <div className="flex flex-col gap-1 text-right">
        <span className="font-bold leading-none">{user?.username}</span>
        <span className="font-light text-xs leading-none">
          gerente financeiro
        </span>
        <span className="font-light text-[0.5rem] leading-none ">
          bateria {batteryStatus.level}% (
          {batteryStatus.isPlugged ? "com" : "sem"} carregador)
        </span>
      </div>
    </div>
  );
};

const CustomerSummary = ({
  currentCustomer,
  formattedTotalAvailable,
  formattedGrossSold,
  formattedCollectedFee,
}: {
  currentCustomer: CustomerEntity | null;
  formattedTotalAvailable: string;
  formattedGrossSold: string;
  formattedCollectedFee: string;
}) => (
  <div className="flex items-center justify-between p-4 pt-0 bg-primary text-primary">
    <div className="bg-secondary text-secondary rounded-lg p-5 w-full grid grid-cols-2 items-center">
      <CustomerInfo currentCustomer={currentCustomer} />
      <FinancialSummary
        formattedTotalAvailable={formattedTotalAvailable}
        formattedGrossSold={formattedGrossSold}
        formattedCollectedFee={formattedCollectedFee}
      />
    </div>
  </div>
);

const CustomerInfo = ({
  currentCustomer,
}: {
  currentCustomer: CustomerEntity | null;
}) => (
  <div className="h-full grid items-center relative">
    <div className="text-[0.7rem] leading-none font-semibold text-[#0E66D8]">
      resumo do cliente
    </div>
    <div className="font-bold text-lg text-ellipsis overflow-hidden whitespace-nowrap">
      {currentCustomer ? (
        currentCustomer.name
      ) : (
        <div className="animate-pulse">Carregando</div>
      )}
    </div>
    <div className="text-xs text-[#aaa]">
      {currentCustomer ? (
        currentCustomer.cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        )
      ) : (
        <div className="animate-pulse">Carregando</div>
      )}
    </div>
  </div>
);

const FinancialSummary = ({
  formattedTotalAvailable,
  formattedGrossSold,
  formattedCollectedFee,
}: {
  formattedTotalAvailable: string;
  formattedGrossSold: string;
  formattedCollectedFee: string;
}) => (
  <div className="h-full grid content-between justify-end text-right">
    <div className="text-[#0E66D8] leading-none text-[0.75rem]">
      disponível <strong>{formattedTotalAvailable}</strong>
    </div>
    <div className="text-[0.67rem] leading-none text-secondary/70">
      bruto vendido <strong>{formattedGrossSold}</strong>
    </div>
    <div className="text-[0.67rem] leading-none text-secondary/70">
      taxa recolhida <strong>{formattedCollectedFee} (3%)</strong>
    </div>
  </div>
);

const TransactionList = ({
  isLoadingTransactions,
  customerTransactions,
  blockTransaction,
  antecipateTransaction,
  resetTransaction,
}: {
  isLoadingTransactions: boolean;
  customerTransactions: TransactionType[];
  blockTransaction: (transactionId: string) => void;
  antecipateTransaction: (transactionId: string) => void;
  resetTransaction: (transactionId: string) => void;
}) => {
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<{
    action: string;
    transactionId: string;
  } | null>(null);

  const handleClickOutside = useCallback(() => {
    setShowOptions(null);
  }, []);

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions, handleClickOutside]);

  const handleOptionsClick = useCallback(
    (event: React.MouseEvent, transactionId: string) => {
      event.stopPropagation();
      setShowOptions((prev) => (prev === transactionId ? null : transactionId));
    },
    []
  );

  const handleActionClick = useCallback(
    (action: string, transactionId: string) => {
      setConfirmationAction({ action, transactionId });
      setShowOptions(null);
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    if (confirmationAction) {
      const { action, transactionId } = confirmationAction;

      switch (action) {
        case "Bloquear transação":
          await blockTransaction(transactionId);
          break;
        case "Adiantar pagamento":
          await antecipateTransaction(transactionId);
          break;
        case "Redefinir transação":
          await resetTransaction(transactionId);
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }

      setConfirmationAction(null);
    }
  }, [
    confirmationAction,
    blockTransaction,
    antecipateTransaction,
    resetTransaction,
  ]);

  const handleCancel = useCallback(() => {
    setConfirmationAction(null);
  }, []);

  return (
    <div className="gap-2 bg-secondary overflow-hidden grid grid-rows-[auto,1fr]">
      <div className="bg-primary text-primary h-20 w-full -mb-20"></div>
      <div className="p-5 pt-0 grid grid-rows-[auto,1fr] overflow-hidden">
        <div className="font-bold pb-2 text-primary">vendas realizadas</div>
        <div className="rounded-lg p-5 w-full flex flex-col gap-10 overflow-auto bg-secondary">
          {isLoadingTransactions ? (
            <div className="animate-pulse">Carregando</div>
          ) : customerTransactions.length === 0 ? (
            <div className="text-center text-secondary bg-secondary">
              Nenhuma transação encontrada
            </div>
          ) : (
            customerTransactions.map((transaction: TransactionType) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onOptionsClick={(event) =>
                  handleOptionsClick(event, transaction.id)
                }
                onActionClick={handleActionClick}
                showOptions={showOptions === transaction.id}
                isBlurred={
                  showOptions !== null && showOptions !== transaction.id
                }
              />
            ))
          )}
        </div>
      </div>
      {confirmationAction && (
        <ConfirmationModal
          action={confirmationAction.action}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

const TransactionItem = ({
  transaction,
  onOptionsClick,
  onActionClick,
  showOptions,
  isBlurred,
}: {
  transaction: TransactionType;
  onOptionsClick: (event: React.MouseEvent) => void;
  onActionClick: (action: string, transactionId: string) => void;
  showOptions: boolean;
  isBlurred: boolean;
}) => {
  const isPending = transaction.status === "pending";

  return (
    <div
      className={`relative transition-filter duration-75 ${
        isBlurred ? "filter blur-[2px] opacity-50" : ""
      } text-black`}
    >
      <div onClick={onOptionsClick}>
        {showOptions && (
          <div className="absolute right-0 top-0 mt-8 mr-4 bg-white shadow-lg rounded-lg z-10">
            <ul className="py-2">
              {isPending ? (
                <>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      onActionClick("Bloquear transação", transaction.id)
                    }
                  >
                    Bloquear transação
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      onActionClick("Adiantar pagamento", transaction.id)
                    }
                  >
                    Adiantar pagamento
                  </li>
                </>
              ) : (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    onActionClick("Redefinir transação", transaction.id)
                  }
                >
                  Redefinir transação
                </li>
              )}
            </ul>
          </div>
        )}
        <Transaction transaction={transaction} />
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  action,
  onConfirm,
  onCancel,
}: {
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const handleClickOutside = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCancel();
  };

  const isBlockAction = action.toLowerCase().includes("bloquear");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg mx-2 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">confirmação</h2>
        <p className="mb-4">
          você tem certeza que deseja {action.toLowerCase()}?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            cancelar
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              isBlockAction
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={onConfirm}
          >
            confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
const EndContractModal = ({
  onClose,
  customerName,
  customerId,
  customerCpf,
  pendingTransactions,
}: {
  onClose: () => void;
  customerName: string;
  customerId: string;
  customerCpf: string;
  pendingTransactions: TransactionType[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refetch } = useCustomers();

  const handleConfirm = async () => {
    setIsLoading(true);
    await Promise.all([
      fetch("http://3.223.4.249/customers/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: customerId, status: "terminated" }),
      }),
      fetch(`http://3.223.4.249/transactions/customer/${customerCpf}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    await refetch();

    setIsLoading(false);
    navigate("/");
    onClose();
  };

  const totalPending = pendingTransactions.reduce(
    (sum, transaction) => sum + parseFloat(transaction.amount),
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg mx-2 text-black">
        <div className="font-bold pb-2">encerramento de contrato</div>
        {pendingTransactions.length > 0 && (
          <div className="bg-yellow-200 text-yellow-800 p-4 rounded mb-4 text-xs">
            <div className="">
              <strong>
                {pendingTransactions.length === 1
                  ? "existe 1 transação pendente"
                  : `existem ${pendingTransactions.length} transações pendentes`}
              </strong>
            </div>
            <div className="pb-2">
              <div className="pb-2">
                Total pendente:{" "}
                <strong>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalPending)}
                </strong>
              </div>
            </div>
            Isso irá disponibilizar automaticamente todos os valores pendentes
            ao cliente, seguido da remoção dessas transações do sistema.
          </div>
        )}
        <div className="text-xs pb-6">
          tem certeza que deseja encerrar o contrato com{" "}
          <strong>{customerName}</strong>?
        </div>
        <div className="flex justify-end gap-4 text-xs">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};
