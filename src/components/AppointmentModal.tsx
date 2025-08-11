"use client";

import {
  AppointmentFormValues,
  Dentist,
  Schedule,
  Service,
  Slot,
} from "@/lib/types";
import { authRequest } from "@/lib/api";
import { JSX, useEffect, useState } from "react";

export default function AppointmentModal({
  dentist,
  onClose,
  onSubmit,
  submitLabel = "Schedule Appointment",
}: {
  dentist: Dentist | null;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => Promise<void> | void;
  submitLabel?: string;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [clientNotes, setClientNotes] = useState("");

  const toLocalYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    if (!dentist) return;

    const fetchSchedules = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();

        const data: Schedule[] = await authRequest(
          `/schedules?dentistId=${dentist.id}&month=${month}&year=${year}&includeSlots=true`
        );

        setSchedules(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setLoadError(err?.message || "Failed to load schedules");
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [dentist, currentMonth]);

  useEffect(() => {
    resetModal();
  }, [dentist?.id]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const slotInfoForDate = (date: Date) => {
    const ymd = toLocalYMD(date);
    const scheduleForDate = schedules.find((sch) => sch.date === ymd);

    if (!scheduleForDate) {
      return { exists: false, booked: 0, total: 0, timeSlots: [] as Slot[] };
    }

    const slots = scheduleForDate.slots ?? [];
    const total = slots.length;
    const booked = slots.filter((s: any) => s.appointment).length;

    return {
      exists: true,
      booked,
      total,
      timeSlots: slots,
    };
  };

  const goBack = () => {
    switch (step) {
      case 1:
        onClose();
        break;
      case 2:
        setSelectedSlot(null);
        setStep(step - 1);
        break;
      case 3:
        setSelectedService(null);
        setStep(step - 1);
        break;
      case 4:
        setClientNotes("");
        setStep(step - 1);
        break;
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedService(null);
    setClientNotes("");
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedService) return;
    await onSubmit({
      slot: selectedSlot,
      service: selectedService,
      notes: clientNotes,
    });
    resetModal();
    onClose();
  };

  if (!dentist) return null;

  const modalTitle = () => {
    switch (step) {
      case 1:
        return `Select Date - ${dentist.name}`;
      case 2:
        return `Select Time - ${dentist.name}`;
      case 3:
        return `Select Service - ${dentist.name}`;
      case 4:
        return `Confirm Appointment`;
    }
  };

  const calendarPage = (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => changeMonth(-1)}
        >
          &lt; Prev
        </button>
        <strong>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => changeMonth(1)}
        >
          Next &gt;
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading availability...</div>
      ) : loadError ? (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <th key={day}>{day}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const weeks: JSX.Element[] = [];
                let days: JSX.Element[] = [];

                for (let i = 0; i < startOfMonth(currentMonth); i++) {
                  days.push(<td key={`empty-${i}`}></td>);
                }

                for (let day = 1; day <= getDaysInMonth(currentMonth); day++) {
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );
                  const slotInfo = slotInfoForDate(date);
                  const disabled =
                    isPastDate(date) ||
                    !slotInfo.exists ||
                    slotInfo.total === 0 ||
                    slotInfo.total === slotInfo.booked;

                  days.push(
                    <td key={day} className={disabled ? "bg-light" : ""}>
                      <button
                        className="btn btn-sm border-0 w-100"
                        disabled={disabled}
                        onClick={() => {
                          setSelectedDate(date);
                          setStep(2);
                        }}
                      >
                        {day}
                        <div
                          className={`${disabled ? "text-muted" : "fw-bold"}`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {!slotInfo.exists
                            ? "No schedule"
                            : `${slotInfo.booked}/${slotInfo.total} booked`}
                        </div>
                      </button>
                    </td>
                  );

                  if (
                    days.length % 7 === 0 ||
                    day === getDaysInMonth(currentMonth)
                  ) {
                    weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
                    days = [];
                  }
                }

                return weeks;
              })()}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const timeSlotsPage = selectedDate && (
    <>
      <h6>
        Date:{" "}
        <span className="text-primary">{selectedDate.toDateString()}</span>
      </h6>
      <div className="d-flex flex-column gap-2">
        {slotInfoForDate(selectedDate).timeSlots.map((slot) => {
          return (
            <button
              key={slot.id}
              className={`btn btn-outline-primary ${
                selectedSlot?.id === slot.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedSlot(slot);
                setStep(step + 1);
              }}
              disabled={!!slot.appointment}
            >
              {slot.slotOption.name}
            </button>
          );
        })}
      </div>
    </>
  );

  const servicesPage = (
    <div className="d-flex flex-column gap-2">
      {(dentist.services || []).map((service) => (
        <button
          key={service.id}
          className={`btn btn-outline-primary ${
            selectedService?.id === service.id ? "active" : ""
          }`}
          onClick={() => {
            setSelectedService(service);
            setStep(step + 1);
          }}
        >
          {service.name}
        </button>
      ))}
    </div>
  );

  const summaryPage = (
    <>
      <p>
        <strong>Dentist:</strong> {dentist.name}
      </p>
      <p>
        <strong>Date:</strong> {selectedDate?.toDateString()}
      </p>
      <p>
        <strong>Time:</strong> {selectedSlot?.slotOption.name}
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
            {step === 1 && calendarPage}
            {step === 2 && timeSlotsPage}
            {step === 3 && servicesPage}
            {step === 4 && summaryPage}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={goBack}>
              Back
            </button>
            {step === 4 && (
              <button className="btn btn-success" onClick={handleSubmit}>
                {submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
