export interface Service {
  id: number;
  name: string;
}

export interface Dentist {
  id: number;
  name: string;
  services: Service[];
}

export interface Client {
  id: number;
  name: string;
  address: string;
}

export interface SlotOption {
  id: number;
  name: string;
}

export interface Appointment {
  slot: Slot;
  client: Client;
  service: Service;
  notes?: string;
}

export interface Slot {
  id: number;
  slot_option: SlotOption;
  schedule: ScheduleSummary; // prevent recursion
  appointment: Appointment;
}

export interface Schedule {
  id: number;
  dentist: Dentist;
  date: string; // ISO format
  slots: Slot[];
}

export interface ScheduleSummary {
  id: number;
  date: string;
  dentist: Dentist;
}

export interface AppointmentFormValues {
  slot: Slot;
  service: Service;
  notes: string;
}
