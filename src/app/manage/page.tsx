"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/lib/types";

export default function SchedulePage() {
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

  const today = new Date();
  const upcomingAppointments = appointments.filter(
    (appt) => new Date(appt.slot.schedule.date) >= today
  );
  const pastAppointments = appointments.filter(
    (appt) => new Date(appt.slot.schedule.date) < today
  );

  const appointmentCard = (appointment: Appointment) => (
    <div className="col-md-4" key={appointment.slot.id}>
      <div className="card h-100 shadow-sm p-3">
        <h5 className="card-title">{appointment.slot.schedule.dentist.name}</h5>
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
              upcomingAppointments.map(appointmentCard)
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </div>

          <h1 className="my-4">Past Appointments</h1>
          <div className="row g-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map(appointmentCard)
            ) : (
              <p>No past appointments.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
