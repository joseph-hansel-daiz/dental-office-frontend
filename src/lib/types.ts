export type UserRole = "admin" | "client";

export interface Service {
  id: number;
  name: string;
}

export interface Dentist {
  id: number;
  name: string;
  services?: Service[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  mobileNumber?: string;
  address?: string;
}

export interface SlotOption {
  id: number;
  name: string;
}

export interface ScheduleSummary {
  id: number;
  date: string;
  dentist: Dentist;
}

export interface Slot {
  id: number;
  slotOption: SlotOption;
  schedule: ScheduleSummary;
  appointment?: {
    id: number;
    userId: number;
    slotId: number;
    serviceId: number;
    notes?: string | null;
  } | null;
}

export interface Schedule {
  id: number;
  date: string;
  dentist: Dentist;
  slots?: Slot[];
}

export interface Appointment {
  id: number;
  slot: Slot;
  user: User;
  service: Service;
  notes?: string;
}

export interface AppointmentFormValues {
  slot: Slot;
  service: Service;
  notes: string;
}
