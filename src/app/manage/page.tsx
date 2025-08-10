"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/lib/types";

export default function ManagePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientAppointments();
  }, []);

  const fetchClientAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/dentist/clients/1/appointments/`
      );
      if (!res.ok) throw new Error("Failed to fetch client appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    // TODO: Show your DentistAvailabilityModal in "reschedule" mode
    console.log("Reschedule appointment:", appointment.slot.id);
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/dentist/appointments/${appointmentId}/cancel`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to cancel appointment");
      alert("Appointment canceled.");
      fetchClientAppointments();
    } catch (err) {
      console.error(err);
      alert("Could not cancel appointment.");
    }
  };

  const getAppointmentDateTime = (appointment: Appointment) => {
    const date = new Date(appointment.slot.schedule.date);
    const timeStr = appointment.slot.slot_option.name; // "hh:mm AM/PM"

    if (timeStr) {
      const [time, modifier] = timeStr.split(" "); // ["10:00", "AM"]
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier.toUpperCase() === "AM" && hours === 12) {
        hours = 0; // midnight case
      }

      date.setHours(hours, minutes, 0, 0);
    }

    return date;
  };

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((appt) => getAppointmentDateTime(appt) >= now)
    .sort(
      (a, b) =>
        getAppointmentDateTime(a).getTime() -
        getAppointmentDateTime(b).getTime()
    );

  const pastAppointments = appointments
    .filter((appt) => getAppointmentDateTime(appt) < now)
    .sort(
      (a, b) =>
        getAppointmentDateTime(b).getTime() -
        getAppointmentDateTime(a).getTime()
    );

  const appointmentCard = (appointment: Appointment, isUpcoming: boolean) => (
    <div className="col-md-4" key={appointment.slot.id}>
      <div className="card h-100 shadow-sm p-3 d-flex flex-column">
        <div className="flex-grow-1">
          <h5 className="card-title">
            {appointment.slot.schedule.dentist.name}
          </h5>
          <p className="card-text mb-1">
            <strong>Date:</strong>{" "}
            {new Date(appointment.slot.schedule.date).toLocaleDateString()}
          </p>
          <p className="card-text mb-1">
            <strong>Time:</strong> {appointment.slot.slot_option.name}
          </p>
          <p className="card-text mb-1">
            <strong>Service:</strong> {appointment.service.name}
          </p>
          {appointment.notes && (
            <p className="card-text mb-1">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>

        {isUpcoming && (
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleReschedule(appointment)}
            >
              Reschedule
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleCancel(appointment.slot.id)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {loading ? (
        <>Loading appointments...</>
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
        </>
      )}
    </div>
  );
}
