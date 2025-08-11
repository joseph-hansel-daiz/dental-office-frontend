"use client";

import AppointmentModal from "@/components/AppointmentModal";
import DentistList from "@/components/DentistList";
import { apiRequest, authRequest } from "@/lib/api";
import { AppointmentFormValues, Dentist } from "@/lib/types";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const dentistsJson = await apiRequest("/dentists?includeServices=true");
      setDentists(dentistsJson);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setLoadError(err?.message || "Failed to load dentists");
      }
      setDentists([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      await authRequest("/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: values.slot.id,
          serviceId: values.service.id,
          notes: values.notes,
        }),
      });

      alert("Appointment scheduled!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule appointment");
    }
  };

  const openModal = (dentist: Dentist) => {
    setSelectedDentist(dentist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDentist(null);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center">Schedule an appointment</h1>

      {loadError && (
        <div className="alert alert-danger my-3" role="alert">
          {loadError}
        </div>
      )}

      <DentistList
        dentists={dentists}
        loading={loading}
        onCheckAvailability={openModal}
      />

      {isModalOpen && selectedDentist && (
        <AppointmentModal
          dentist={selectedDentist}
          onClose={closeModal}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
