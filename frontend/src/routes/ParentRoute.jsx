import { Navigate } from "react-router-dom";

export default function ParentRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user?.role !== "parent") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}