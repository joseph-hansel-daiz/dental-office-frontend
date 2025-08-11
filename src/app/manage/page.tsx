"use client";

import AppointmentModal from "@/components/AppointmentModal";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { authRequest } from "@/lib/api";
import { Appointment, AppointmentFormValues } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function ManagePage() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await authRequest(`/appointments`);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const openReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleOpen(true);
  };

  const closeReschedule = () => {
    setIsRescheduleOpen(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleSubmit = async (appointment: AppointmentFormValues) => {
    if (!selectedAppointment) return;

    try {
      await authRequest(`/appointments/${selectedAppointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: appointment.slot.id,
          serviceId: appointment.service.id,
          notes: appointment.notes,
        }),
      });

      alert("Appointment rescheduled.");
      closeReschedule();
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Could not reschedule appointment.");
    }
  };

  const getAppointmentDateTime = (appointment: Appointment) => {
    const scheduleDate = appointment?.slot?.schedule?.date; // "YYYY-MM-DD"
    const timeStr = appointment?.slot?.slotOption?.name; // e.g., "10:00 AM"
    if (!scheduleDate) return new Date(NaN);

    const [y, m, d] = scheduleDate.split("-").map((n) => parseInt(n, 10));
    const date = new Date(y, (m ?? 1) - 1, d ?? 1);

    if (timeStr) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = (time || "")
        .split(":")
        .map((n) => parseInt(n, 10));
      if (!Number.isFinite(hours)) hours = 0;
      if (!Number.isFinite(minutes)) minutes = 0;
      if (modifier?.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
      date.setHours(hours, minutes, 0, 0);
    }
    return date;
  };

  const now = new Date();

  const [upcomingAppointments, pastAppointments] = useMemo(() => {
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    for (const appointment of appointments) {
      const appointmentDateTime = getAppointmentDateTime(appointment);
      if (isNaN(appointmentDateTime.getTime())) {
        past.push(appointment);
      } else if (appointmentDateTime >= now) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    }

    upcoming.sort(
      (a, b) =>
        getAppointmentDateTime(a).getTime() -
        getAppointmentDateTime(b).getTime()
    );
    past.sort(
      (a, b) =>
        getAppointmentDateTime(b).getTime() -
        getAppointmentDateTime(a).getTime()
    );

    return [upcoming, past];
  }, [appointments]);

  const appointmentCard = (appointment: Appointment, isUpcoming: boolean) => (
    <div className="col-md-4" key={appointment.id}>
      <div className="card h-100 shadow-sm p-3 d-flex flex-column">
        <div className="flex-grow-1">
          <h5 className="card-title">
            {user?.role === "admin"
              ? appointment.user.name
              : appointment?.slot?.schedule?.dentist?.name}
          </h5>

          {user?.role === "admin" ? (
            <p className="card-text mb-1">
              <strong>Doctor:</strong>{" "}
              {appointment?.slot?.schedule?.dentist?.name}
            </p>
          ) : (
            <></>
          )}

          <p className="card-text mb-1">
            <strong>Date:</strong>{" "}
            {appointment?.slot?.schedule?.date
              ? new Date(appointment.slot.schedule.date).toLocaleDateString()
              : "—"}
          </p>
          <p className="card-text mb-1">
            <strong>Time:</strong> {appointment?.slot?.slotOption?.name ?? "—"}
          </p>
          <p className="card-text mb-1">
            <strong>Service:</strong> {appointment?.service?.name ?? "—"}
          </p>
          {appointment?.notes && (
            <p className="card-text mb-1">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>

        {user?.role === "client" && isUpcoming && (
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => openReschedule(appointment)}
            >
              Reschedule
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleCancelButtonClick(appointment.id)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const handleCancelButtonClick = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await authRequest(`/appointments/${appointmentId}`, { method: "DELETE" });
      alert("Appointment canceled.");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Could not cancel appointment.");
    }
  };

  return (
    <div className="container py-4">
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <h1 className="mb-4">Upcoming Appointments</h1>
          <div className="row g-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => appointmentCard(appt, true))
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </div>

          <h1 className="my-4">Past Appointments</h1>
          <div className="row g-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => appointmentCard(appt, false))
            ) : (
              <p>No past appointments.</p>
            )}
          </div>

          {isRescheduleOpen && selectedAppointment && (
            <AppointmentModal
              dentist={selectedAppointment.slot?.schedule?.dentist}
              onClose={closeReschedule}
              onSubmit={async (vals) =>
                handleRescheduleSubmit({
                  slot: vals.slot,
                  service: vals.service,
                  notes: vals.notes,
                })
              }
              submitLabel="Reschedule Appointment"
            />
          )}
        </>
      )}
    </div>
  );
}
