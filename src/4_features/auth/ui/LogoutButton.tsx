import { useLogout } from '../model/useLogout';
import { Button } from '@/6_shared/ui/button';

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <>
      <Button onClick={() => logout()} disabled={isPending}>
        Logout
      </Button>
    </>
  );
};
