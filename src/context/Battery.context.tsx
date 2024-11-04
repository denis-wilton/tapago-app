import React, { createContext, useCallback, useState, useEffect } from "react";

const BatteryContext = createContext<ReturnType<typeof useBatteryContext>>(
  null as any
);

function useBatteryContext() {
  const [batteryStatus, setBatteryStatus] = useState<{
    level: number;
    isPlugged: boolean;
  }>({ level: 100, isPlugged: false });

  const updateBatteryStatus = useCallback(
    (status: { level: number; isPlugged: boolean }) => {
      setBatteryStatus(status);
    },
    []
  );

  useEffect(() => {
    const onBatteryStatus = (status: { level: number; isPlugged: boolean }) => {
      updateBatteryStatus(status);
    };

    window.addEventListener(
      "batterystatus",
      onBatteryStatus as unknown as EventListener,
      false
    );

    return () => {
      window.removeEventListener(
        "batterystatus",
        onBatteryStatus as unknown as EventListener,
        false
      );
    };
  }, [updateBatteryStatus]);

  return { batteryStatus, updateBatteryStatus };
}

const BatteryProvider = ({ children }: { children: React.ReactNode }) => {
  const battery = useBatteryContext();

  return (
    <BatteryContext.Provider value={battery}>
      {children}
    </BatteryContext.Provider>
  );
};

const useBattery = () => {
  const battery = React.useContext(BatteryContext);

  if (!battery) {
    throw new Error("useBattery must be used within a BatteryProvider");
  }

  return battery;
};

export { BatteryContext, useBatteryContext, BatteryProvider, useBattery };
