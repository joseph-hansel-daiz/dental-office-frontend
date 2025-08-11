"use client";

import { useAuth } from "@/context/AuthContext";
import { authRequest } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobileNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authRequest("/users/me");
      setFormData({
        email: data.email,
        name: data.name,
        mobileNumber: data.mobileNumber || "",
        address: data.address || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const updatedUser = await authRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
        }),
      });

      login(localStorage.getItem("authToken")!, updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4 text-center">My Profile</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("success") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              readOnly
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              className="form-control"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
