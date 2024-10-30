import Bag from "../../../assets/bag.svg";
import type { Transaction } from "../../../context/Transactions.context";

export default function Transaction(props: { transaction: Transaction }) {
  const { transaction } = props;
  const transactionTime = new Date(transaction.createdAt);

  const calculateDaysUntilAvailable = (date: Date) => {
    const transactionTimePlus30Days = new Date(
      date.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return Math.ceil(
      (transactionTimePlus30Days.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  };

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(transaction.amount));

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "available":
        return { color: "text-green-600", text: "disponível" };
      case "block":
        return { color: "text-red-500", text: "bloqueado" };
      case "pending":
      default:
        return {
          color: "text-[#0E66D8]",
          text: `disponível em ${calculateDaysUntilAvailable(
            transactionTime
          )}d`,
        };
    }
  };

  const statusInfo = getStatusInfo(transaction.status);

  return (
    <div className="grid grid-cols-[44px,minmax(0px,150px),auto] items-center gap-2">
      <div className="bg-gray-300 p-3 rounded-full">
        <img src={Bag} alt="Bag" />
      </div>
      <div>
        <div className="font-bold text-sm text-secondary text-ellipsis w-full whitespace-nowrap overflow-hidden">
          {transaction.description}
        </div>
        <div className="font-regular text-sm text-[#777]">
          {transactionTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div className="text-right flex flex-col gap-2">
        <div className="font-bold text-sm text-secondary">
          {formattedAmount}
        </div>
        <div className={`font-regular ${statusInfo.color} text-xs`}>
          {statusInfo.text}
        </div>
      </div>
    </div>
  );
}
