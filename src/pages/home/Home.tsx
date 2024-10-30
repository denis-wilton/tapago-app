import React, { useEffect } from "react";
import { useAuth } from "../../context/Auth.context";
import Bag from "../../assets/bag.svg";
import { useCustomers } from "../../context/Customers.context";
import { useState } from "react";

export default function Home() {
  const { customers, isLoading } = useCustomers();
  const { user } = useAuth();

  useEffect(() => {
    console.log("customers from home", customers);
  }, [customers]);

  return (
    <>
      <div className="h-full grid grid-rows-[auto,auto,auto,1fr] overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-5 bg-primary text-primary">
          <h1 className="font-bold leading-none">tapago</h1>
          <div className="flex flex-col gap-2 text-right">
            <span className="font-bold leading-none">{user?.username}</span>
            <span className="font-light text-xs leading-none">
              gerente financeiro
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 pt-0 bg-primary text-primary">
          <input
            placeholder="buscar cliente"
            className="w-full p-2 bg-white/10 text-primary rounded-lg placeholder-white/60 text-xs px-3"
            type="text"
          />
        </div>
        <div className="flex items-center justify-between p-4 pt-0 bg-primary text-primary">
          <div className="bg-secondary text-secondary rounded-lg p-5 w-full grid grid-cols-2 items-center">
            <div className="h-full grid items-center relative">
              <div className="text-[0.7rem] leading-none font-semibold text-[#0E66D8]">
                {window.location.href}
              </div>
              <div className="font-bold text-lg text-ellipsis overflow-hidden whitespace-nowrap">
                {customers && customers[0] && customers[0].name ? (
                  customers[0].name
                ) : (
                  <div className="animate-pulse">Carregando</div>
                )}
              </div>
              <div className="text-xs text-[#aaa]">065.342.901-03</div>
            </div>
            <div className="h-full grid content-between justify-end text-right">
              <div className="text-[#0E66D8] leading-none text-[0.75rem]">
                disponível <strong>R$ 184,29</strong>
              </div>
              <div className="h-1"></div>
              <div className="text-[0.67rem] leading-none text-secondary/70">
                bruto vendido <strong>R$ 18.220,56</strong>
              </div>
              <div className="text-[0.67rem] leading-none text-secondary/70">
                taxa recolhida <strong>R$ 546,61 (3%)</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-2  bg-secondary overflow-hidden grid grid-rows-[auto,1fr]">
          <div className="bg-primary text-primary h-20 w-full -mb-20"></div>
          <div className="p-5 pt-0 grid grid-rows-[auto,1fr] overflow-hidden">
            <div className="font-bold pb-2 text-primary">vendas realizadas</div>
            <div className="rounded-lg p-5 w-full flex flex-col gap-10 overflow-auto bg-secondary">
              <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
                <div className="bg-gray-300 p-3 rounded-full">
                  <img src={Bag} alt="Bag" />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
                    Smartband Mi Band 6
                  </div>
                  <div className="font-regular text-sm text-[#777]">18:01</div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-sm text-secondary">
                    R$ 350,15
                  </div>
                  <div className="font-regular text-[#0E66D8] text-xs">
                    disponível em 29d
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
                <div className="bg-gray-300 p-3 rounded-full">
                  <img src={Bag} alt="Bag" />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
                    Apple iPhone 15
                  </div>
                  <div className="font-regular text-sm text-[#777]">17:21</div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-sm text-secondary">
                    R$ 9.130,20
                  </div>
                  <div className="font-regular text-[#0E66D8] text-xs">
                    disponível em 25d
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
                <div className="bg-gray-300 p-3 rounded-full">
                  <img src={Bag} alt="Bag" />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
                    Apple iPhone 13 Pro Max
                  </div>
                  <div className="font-regular text-sm text-[#777]">14:45</div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-sm text-secondary whitespace-nowrap">
                    R$ 8.550,22
                  </div>
                  <div className="font-regular text-[#0E66D8] text-xs">
                    disponível em 14d
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
                <div className="bg-gray-300 p-3 rounded-full">
                  <img src={Bag} alt="Bag" />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
                    Película de Vidro
                  </div>
                  <div className="font-regular text-sm text-[#777]">14:37</div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-sm text-secondary">
                    R$ 39,99
                  </div>
                  <div className="font-regular bg-green-600 text-white text-center rounded-md flex items-center justify-center leading-none py-0.5 px-2 text-xs">
                    saque disponível
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
                <div className="bg-gray-300 p-3 rounded-full">
                  <img src={Bag} alt="Bag" />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
                    Sinal PIX 150
                  </div>
                  <div className="font-regular text-sm text-[#777]">11:14</div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-sm text-secondary">
                    R$ 150,00
                  </div>
                  <div className="font-regular bg-green-600 text-white text-center rounded-md flex items-center justify-center leading-none py-0.5 px-2 text-xs">
                    saque disponível
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
