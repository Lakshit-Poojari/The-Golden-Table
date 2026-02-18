import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StaffAxios from "../../API/StaffAxios/StaffAxios";

const StaffAuthContext = createContext();

const StaffAuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null); //

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const staffAuth = async () => {
    const token = localStorage.getItem("staff_access");

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await StaffAxios.get("profile/");

      setIsAuthenticated(true);
      setStaff(res.data);
    } catch {
      localStorage.removeItem("staff_access");
      localStorage.removeItem("staff_refresh");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/staff/login") {
      setLoading(false);
      return;
    }

    staffAuth();
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("staff_access");
    localStorage.removeItem("staff_refresh");
    setIsAuthenticated(false);
    navigate("/staff/login");
  };

  return (
    <StaffAuthContext.Provider
      value={{ staffAuth, isAuthenticated, staff, loading, logout }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

const useStaffAuth = () => useContext(StaffAuthContext);

export { StaffAuthProvider, useStaffAuth };
