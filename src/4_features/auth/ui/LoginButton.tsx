import { useLogin } from '../model/useLogin'

export const LoginButton = () => {
  const { mutate:login, isPending } = useLogin()

  return (
    <>
      <button onClick={()=>login()} disabled={isPending}>Google Login</button>
    </>
  )
}
