import { useEffect } from "react";
import { useAuth } from "AuthContext";

function Logout() {
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout(); // This will clear localStorage and redirect
  }, [handleLogout]);

  return null;
}

export default Logout;
