
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return <Button onClick={logout}>Logout</Button>;
};
