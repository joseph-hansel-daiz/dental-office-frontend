"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        mobile: user.mobile || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      mobile: formData.mobile,
      address: formData.address,
    };
    // login(token, updatedUser);
    alert("Profile updated successfully!");
  };

  return (
    <section
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4 text-center">My Profile</h2>
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
              className="form-control"
              value={formData.name}
              readOnly
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="form-control"
              value={formData.mobile}
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

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
}
