"use client";

import { Appointment } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

interface RescheduleContextType {
  appointment: Appointment | null;
  setAppointment: (appointment: Appointment) => void;
}

const RescheduleContext = createContext<RescheduleContextType | undefined>(
  undefined
);

export const RescheduleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  return (
    <RescheduleContext.Provider value={{ appointment, setAppointment }}>
      {children}
    </RescheduleContext.Provider>
  );
};

export const useReschedule = () => {
  const context = useContext(RescheduleContext);
  if (!context) {
    throw new Error("useReschedule must be used within a RescheduleProvider");
  }
  return context;
};
