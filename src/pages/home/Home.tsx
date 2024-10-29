import React from "react";
import { useAuth } from "../../context/Auth.context";
import Bag from "../../assets/bag.svg";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="flex items-start justify-between p-8 bg-primary text-primary">
        <h1 className="font-bold leading-none">tapago</h1>
        <div className="flex flex-col gap-2 text-right">
          <span className="font-bold leading-none">{user?.username} </span>
          <span className="font-light text-xs leading-none">
            gerente financeiro
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 pt-0 bg-primary text-primary">
        <input
          placeholder="Buscar cliente"
          className="w-full p-2 bg-white/10 text-primary rounded-lg placeholder-white/60"
          type="text"
        />
      </div>
      <div className="flex items-center justify-between p-4 pt-0 bg-primary text-primary">
        <div className="bg-secondary text-secondary rounded-lg p-5 w-full grid grid-cols-2 items-center">
          <div className="h-full grid items-center">
            <div className="text-[0.6rem] font-semibold text-[#0E66D8]">
              resumo do cliente
            </div>
            <div className="font-bold text-lg">Irapuan Noce</div>
            <div className="text-xs text-[#aaa]">065.342.901-03</div>
          </div>
          <div className="h-full grid items-center justify-end text-right">
            <div className="text-[#0E66D8]">
              disponível <strong>R$ 9.000,22</strong>
            </div>
            <div className="text-[0.7rem] leading-none text-[#aaa]">
              bruto vencido <strong>R$ 11.541,95</strong>
            </div>
            <div className="text-[0.7rem] leading-none text-[#aaa]">
              taxa atual <strong>3%</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2  bg-secondary">
        <div className="bg-primary text-primary h-20 w-full -mb-20"></div>
        <div className="p-5 pt-0">
          <div className="font-bold pb-2 text-primary">vendas realizadas</div>
          <div className="bg-secondary rounded-lg p-5 w-full flex flex-col gap-2">
            <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
              <div className="bg-gray-300 p-3 rounded-full">
                <img src={Bag} alt="Bag" />
              </div>
              <div>
                <div className="font-bold text-sm">Smartband XYZ 3.0</div>
                <div className="font-regular text-sm text-[#777]">14:37</div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <div className="font-bold text-sm">R$ 50,75</div>
                <div className="font-regular text-[#0E66D8] text-xs">
                  disponível em 14d
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
