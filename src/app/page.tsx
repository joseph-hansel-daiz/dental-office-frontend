"use client";

import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Service } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = (await apiRequest("/services")) as Service[];
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <section
      id="hero"
      className="d-flex align-items-center justify-content-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="container">
        <div className="d-flex flex-column gap-4 align-items-center">
          <h1 className="text-primary fw-bold">Dental Office</h1>

          <p className="text-secondary fs-5" style={{ maxWidth: "700px" }}>
            Providing quality dental care for the whole family. From general
            checkups to orthodontics and cosmetic dentistry, we’re here to keep
            your smile healthy and bright.
          </p>

          <div className="w-100" style={{ maxWidth: "260px" }}>
            <h4 className="mb-3">Our Services</h4>
            <ul className="list-group list-group-flush text-center">
              {loading ? (
                <li className="list-group-item text-muted">Loading…</li>
              ) : services.length > 0 ? (
                services.map((s) => (
                  <li key={s.id} className="list-group-item">
                    {s.name}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">
                  No services found.
                </li>
              )}
            </ul>
          </div>

          {!isAdmin && (
            <a href={PATHS.SCHEDULE} className="btn btn-primary btn-lg mt-4">
              Schedule an Appointment
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
