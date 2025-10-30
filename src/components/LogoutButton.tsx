
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
