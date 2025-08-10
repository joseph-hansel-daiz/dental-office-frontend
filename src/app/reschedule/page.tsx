"use client";

import AppointmentCreationModal from "@/components/AppointmentCreationModal";
import DentistList from "@/components/DentistList";
import { useReschedule } from "@/context/RescheduleContext";
import { AppointmentFormValues, Dentist } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ReschedulePage() {
  const { appointment } = useReschedule();

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
        dentistsJson.map((dentist: any) => ({
          id: dentist.id,
          name: dentist.name,
          services: dentist.services,
        }))
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
      <h1 className="text-center mb-4">Reschedule an Appointment</h1>

      {/* Current Appointment Details */}
      {appointment ? (
        <>
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="card-title">
              {appointment.slot.schedule.dentist.name}
            </h5>
            <p className="mb-1">
              <strong>Date:</strong>{" "}
              {new Date(appointment.slot.schedule.date).toLocaleDateString()}
            </p>
            <p className="mb-1">
              <strong>Time:</strong> {appointment.slot.slot_option.name}
            </p>
            <p className="mb-1">
              <strong>Service:</strong> {appointment.service.name}
            </p>
            {appointment.notes && (
              <p className="mb-0">
                <strong>Notes:</strong> {appointment.notes}
              </p>
            )}
          </div>
          {/* Dentist list */}
          <DentistList
            dentists={dentists}
            loading={loading}
            onCheckAvailability={openModal}
          />

          {/* Availability Modal */}
          {isModalOpen && (
            <AppointmentCreationModal
              dentist={selectedDentist}
              onClose={closeModal}
              onSubmit={onSubmit}
              submitLabel="Reschedule Appointment"
            />
          )}
        </>
      ) : (
        <p className="text-muted">No appointment selected.</p>
      )}
    </div>
  );
}
