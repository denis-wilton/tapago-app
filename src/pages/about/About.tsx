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
  const { batteryStatus } = useBattery();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header user={user} />
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <h2 className="font-bold text-xl pb-2 text-black">sobre a tapago</h2>
          <p className="text-sm text-gray-500 py-2">
            a tapago é uma empresa fictícia de processamento de transações.
          </p>
          <p className="text-sm text-gray-500 py-2">
            todo o projeto tem unicamente fins didáticos, fazendo parte do
            componente curricular{" "}
            <strong>Tópicos Especiais em Engenharia de Software</strong>,
            ministrado pelo professor <strong>Jivago Medeiros</strong>.
          </p>
          <p className="text-sm text-gray-500 py-2">
            o estudantes que compõem o grupo são:
          </p>
          <ul className="text-gray-800 py-3 flex flex-col gap-3 text-xs border rounded p-3">
            <li>DENIS WILTON DE PAULA AZEVEDO</li>
            <li>GUILHERME NUNES AZEVEDO</li>
            <li>JAIRO DE SOUZA MENDES JUNIOR</li>
            <li>WINICIUS ALEJANDRO SOUZA CASMAL</li>
          </ul>
          <p className="text-sm text-gray-500 py-2">
            tecnologias front-end utilizadas:
          </p>
          <ul className="text-gray-800 py-3 flex flex-col gap-3 text-xs border rounded p-3">
            <li>React</li>
            <li>React Query</li>
            <li>React Router Dom</li>
            <li>Typescript</li>
            <li>TailwindCSS</li>
            <li>Cordova</li>
          </ul>

          <p className="text-sm text-gray-500 py-2">
            plugins Cordova utilizados
          </p>
          <ul className="text-gray-800 py-3 flex flex-col gap-3 text-xs border rounded p-3">
            <li>cordova-plugin-ionic-webview</li>
            <p className="text-gray-500 pl-3 italic text-[0.7rem]">
              Responsável por fornecer uma webview capaz de importar módulos ES6
              e realizar requisições fetch na web.
            </p>
            <li>cordova-plugin-battery-status</li>
            <p className="text-gray-500 pl-3 italic text-[0.7rem]">
              Fornece eventos de nível de bateria do dispositivo, inclusive,
              neste momento, está em {batteryStatus.level}% e{" "}
              {batteryStatus.isPlugged ? "com carregador" : "sem carregador"}.
            </p>
          </ul>

          <p className="text-sm text-gray-500 py-2">
            além disso, diversas tecnologias foram utilizadas no backend para
            servir a aplicação:
          </p>

          <ul className="text-gray-800 py-3 flex flex-col gap-3 text-xs border rounded p-3">
            <li>NodeJS</li>
            <li>Express</li>
            <li>Firebase / Firestore</li>
            <li>Docker / Docker compose</li>
            <li>nginx</li>
            <li>Amazon Lightsail</li>
          </ul>
        </div>
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
