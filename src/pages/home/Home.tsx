import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import {
  Customer as CustomerEntity,
  useCustomers,
} from "../../context/Customers.context";
import Navbar from "../../components/Navbar/Navbar";
import { useBattery } from "../../context/Battery.context";

export default function Home() {
  const { user } = useAuth();
  const { customers, refetch } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToRemove, setCustomerToRemove] =
    useState<CustomerEntity | null>(null);

  const navigate = useNavigate();

  const navigateToCustomer = (cpf: string) => {
    navigate(`/cliente/${cpf}`);
  };

  const handleRemoveCustomer = (customer: any) => {
    setCustomerToRemove(customer);
    setIsModalOpen(true);
  };

  const confirmRemoveCustomer = async () => {
    if (customerToRemove) {
      console.log(`Removing customer with id: ${customerToRemove.id}`);

      await fetch(`http://3.223.4.249/customers/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: customerToRemove.id }),
      });

      await refetch();

      setIsModalOpen(false);
      setCustomerToRemove(null);
    }
  };

  const fuzzySearch = (
    term: string,
    items: CustomerEntity[],
    keys: string[]
  ) => {
    const lowerTerm = term
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return items
      .map((item) => {
        const highlightedItem: { [key: string]: any } = { ...item };
        keys.forEach((key) => {
          const originalValue = (item as any)[key];
          const normalizedValue = originalValue
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          let match = false;
          let j = 0;
          let highlightedValue = "";
          for (let i = 0; i < originalValue.length; i++) {
            const normalizedChar = normalizedValue[i];
            if (normalizedChar === lowerTerm[j]) {
              highlightedValue += `<span class="bg-yellow-300">${originalValue[i]}</span>`;
              j++;
            } else {
              highlightedValue += originalValue[i];
            }
            if (j === lowerTerm.length) {
              match = true;
            }
          }
          if (match) {
            highlightedItem[key] = highlightedValue;
          }
        });
        return highlightedItem;
      })
      .filter((item) =>
        keys.some((key) => item[key].includes('<span class="bg-yellow-300">'))
      );
  };

  const filteredCustomers = searchTerm
    ? fuzzySearch(searchTerm, customers || [], ["name"])
    : customers;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header user={user} />
      <Navbar />
      <div className="p-5 flex justify-between items-center">
        <input
          type="text"
          placeholder="filtrar"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 p-2 bg-primary text-primary rounded-lg whitespace-nowrap text-xs py-3"
          onClick={() => navigate("/add-customer")}
        >
          novo cliente
        </button>
      </div>
      <div className="overflow-scroll">
        <div className="flex flex-col gap-4 overflow-scroll p-5">
          {filteredCustomers?.map((customer) => (
            <div
              key={customer.id}
              className={
                "card shadow-md rounded-lg overflow-hidden p-4 py-2" +
                (customer.status && customer.status === "terminated"
                  ? " bg-red-100"
                  : " bg-white")
              }
              onClick={() =>
                !(customer.status && customer.status === "terminated") &&
                navigateToCustomer(customer.cpf)
              }
            >
              <div className="card-header flex items-center justify-between">
                <h2
                  className="text-lg font-bold text-black"
                  dangerouslySetInnerHTML={{ __html: customer.name }}
                />
              </div>
              <div className="card-body mt-2">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">CPF:</span>{" "}
                  {(customer?.cpf ?? "SEM CPF").replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Email:</span> {customer.email}
                </div>
                {customer.status && customer.status === "terminated" && (
                  <div className="text-sm text-red-500 mt-3 flex flex-col gap-2">
                    <div>contrato encerrado</div>
                    <button
                      className="text-sm bg-red-500 text-white p-0.5 px-2 rounded"
                      onClick={() => handleRemoveCustomer(customer)}
                    >
                      remover cliente da base
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <Modal
          title="confirmar remoção"
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmRemoveCustomer}
        >
          tem certeza que deseja remover o cliente da base?
        </Modal>
      )}
    </div>
  );
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

const Modal = ({
  title,
  children,
  onClose,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg text-black">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="mb-4">{children}</div>
      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={onClose}
        >
          cancelar
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          confirmar
        </button>
      </div>
    </div>
  </div>
);
