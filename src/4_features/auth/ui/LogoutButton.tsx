import { useLogout } from '../model/useLogout'

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout()

  return (
    <>
      <button onClick={() => logout()} disabled={isPending}>
        Logout
      </button>
    </>
  )
}
