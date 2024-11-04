import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import { useCustomers } from "../../context/Customers.context";
import { useBattery } from "../../context/Battery.context";

export default function AddCustomer() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { refetch } = useCustomers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer = { name, cpf, email };
    await fetch("http://3.223.4.249/customers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });
    await refetch();
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header user={user} />
      <div className="p-5 flex justify-center items-center">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nome"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cpf"
            >
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              placeholder="CPF"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="p-2 bg-primary text-primary rounded-lg"
            >
              Adicionar Cliente
            </button>
          </div>
        </form>
      </div>
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
