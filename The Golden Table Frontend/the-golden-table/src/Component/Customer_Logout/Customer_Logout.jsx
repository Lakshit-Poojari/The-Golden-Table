import { useCustomerAuth } from "../../Context/CustomerAuthContext/CustomerAuthContext";

function LogoutButton() {
  const { logout } = useCustomerAuth();

  return (
    <button onClick={logout} style={{ cursor: "pointer" }}>
      Logout
    </button>
  );
}

export default LogoutButton;
