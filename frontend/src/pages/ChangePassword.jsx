import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      await API.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      alert("Password changed successfully. Please login again.");

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[28px] bg-white border border-slate-200 p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Change Password
        </h1>

        <p className="mt-2 text-slate-500">
          Please change your temporary password before continuing.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Temporary Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
          />

          <button className="w-full rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}