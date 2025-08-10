"use client";

import { Appointment, AppointmentFormValues, Service, Slot } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AppointmentCreationModal({
  appointment,
  onClose,
  onSubmit,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => Promise<void> | void;
}) {
  const [step, setStep] = useState(3);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientNotes, setClientNotes] = useState("");

  useEffect(() => {
    if (!appointment) return;

    const fetchDentist = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/dentist/dentists/${appointment.slot.schedule.dentist.id}/`
        );
        if (!res.ok) throw new Error("Failed to load dentist");

        const data = await res.json();
        setServices(data.services);
      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDentist();
  }, [appointment]);

  const goBack = () => {
    switch (step) {
      case 3:
        setSelectedService(null);
        onClose();
        break;
      case 4:
        setClientNotes("");
        setStep(step - 1);
        break;
    }
  };

  const resetModal = () => {
    setStep(3);
    setSelectedService(null);
    setClientNotes("");
  };

  const handleSubmit = async () => {
    if (!appointment || !selectedService) return;
    await onSubmit({
      slot: appointment.slot,
      service: selectedService,
      notes: clientNotes,
    });
    resetModal();
    onClose();
  };

  if (!appointment?.slot) return null;

  const modalTitle = () => {
    switch (step) {
      case 3:
        return `Select Service - ${appointment.slot.schedule.dentist.name}`;
      case 4:
        return `Confirm Appointment`;
    }
  };

  const servicesPage = (
    <div className="d-flex flex-column gap-2">
      {loading ? (
        <>Loading appointments...</>
      ) : (
        <>
          {services.map((service) => (
            <button
              key={service.id}
              className={`btn btn-outline-primary ${
                selectedService === service ? "active" : ""
              }`}
              onClick={() => {
                setSelectedService(service);
                setStep(step + 1);
              }}
            >
              {service.name}
            </button>
          ))}
        </>
      )}
    </div>
  );

  const summaryPage = (
    <>
      <p>
        <strong>Dentist:</strong> {appointment.slot.schedule.dentist.name}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(appointment.slot.schedule.date).toDateString()}
      </p>
      <p>
        <strong>Time:</strong> {appointment.slot.slot_option.name}
      </p>
      <p>
        <strong>Service:</strong> {selectedService?.name}
      </p>
      <div className="mb-3">
        <label className="form-label">Client Notes</label>
        <textarea
          className="form-control"
          rows={3}
          value={clientNotes}
          onChange={(e) => setClientNotes(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      role="dialog"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        style={{ maxWidth: "800px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle()}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {step === 3 && servicesPage}
            {step === 4 && summaryPage}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={goBack}>
              Back
            </button>
            {step === 4 && (
              <button className="btn btn-success" onClick={handleSubmit}>
                Update Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
