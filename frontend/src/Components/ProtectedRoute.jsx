import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!status) {
    // 👇 save current location
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
