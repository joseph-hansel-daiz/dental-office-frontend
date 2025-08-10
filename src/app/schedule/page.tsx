"use client";

import DentistAvailabilityModal from "@/components/DentistAvailabilityModal";
import DentistList from "@/components/DentistList";
import { AppointmentFormValues, Dentist, Service, Slot } from "@/lib/types";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/dentist/dentists`);
      if (!res.ok) throw new Error("Failed to fetch dentists");
      const dentistsJson = await res.json();
      setDentists(
        dentistsJson.map((dentist: any) => {
          return {
            id: dentist.id,
            name: dentist.name,
            services: dentist.services,
          };
        })
      );
    } catch (err) {
      console.error(err);
      setDentists([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/dentist/appointments/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: 1,
            slot_id: values.slot.id,
            service_id: values.service.id,
            notes: values.notes,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to schedule appointment");
      alert("Appointment scheduled!");
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
      <DentistList
        dentists={dentists}
        loading={loading}
        onCheckAvailability={openModal}
      ></DentistList>

      {/* Availability Modal */}
      {isModalOpen && (
        <DentistAvailabilityModal
          dentist={selectedDentist}
          onClose={closeModal}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
