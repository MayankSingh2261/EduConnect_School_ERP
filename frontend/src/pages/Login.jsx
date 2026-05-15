import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

       if (
      res.data.user.role === "parent"
    ) {

      navigate("/parent");

    } else if (
      res.data.user.role === "teacher"
    ) {

      navigate("/teacher");

    } else if (
          res.data.user.role === "student"
      ) {

      navigate("/student");

      }else {

      navigate("/");
}
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">EduConnect Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-900 text-white py-3 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}