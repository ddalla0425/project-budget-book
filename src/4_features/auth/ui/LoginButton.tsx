import { useLogin } from '../model/useLogin'
import { Button } from '@/6_shared/ui/button'

export const LoginButton = () => {
  const { mutate:login, isPending } = useLogin()

  return (
    <>
      <Button onClick={()=>login()} disabled={isPending}>Google Login</Button>
    </>
  )
}
